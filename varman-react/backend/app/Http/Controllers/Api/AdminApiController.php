<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\VarmanApiSupport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminApiController extends Controller
{
    public function __construct(private readonly VarmanApiSupport $support)
    {
    }

    public function login(Request $request): JsonResponse
    {
        $ip = $this->support->getClientIp($request);

        if (! $this->support->checkRateLimit('login:'.$ip, 5, 900)) {
            return response()->json(['error' => 'Too many login attempts, please try again later.'], 429);
        }

        $data = $this->support->payload($request);
        $username = strtolower(trim((string) ($data['username'] ?? '')));
        $password = (string) ($data['password'] ?? '');

        if ($username === '' || $password === '') {
            return response()->json(['error' => 'Invalid credentials format'], 400);
        }

        $admin = DB::table('admin_users')->where('username', $username)->first();

        if (! $admin || ! Hash::check($password, $admin->password_hash)) {
            usleep(100000);

            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $payload = [
            'id' => (int) $admin->id,
            'username' => $admin->username,
            'name' => $admin->name,
            'email' => $admin->email,
            'role' => $admin->role,
            'iat' => time(),
            'exp' => time() + (int) config('varman.jwt_exp', 86400),
        ];

        $token = $this->support->issueToken($payload);

        $this->support->logActivity('login', $admin->username, 'admin_user', (string) $admin->id, 'Admin login successful', $ip);

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => (int) $admin->id,
                'username' => $admin->username,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
            ],
        ]);
    }

    public function verify(Request $request): JsonResponse
    {
        return response()->json([
            'valid' => true,
            'user' => $request->attributes->get('admin_user'),
        ]);
    }

    public function upload(Request $request): JsonResponse
    {
        if (! $request->hasFile('image')) {
            return response()->json(['error' => 'No file uploaded'], 400);
        }

        $file = $request->file('image');

        if (! $file || ! $file->isValid()) {
            return response()->json(['error' => 'Upload error'], 400);
        }

        if (($file->getSize() ?? 0) > 5 * 1024 * 1024) {
            return response()->json(['error' => 'File too large. Maximum size is 5MB.'], 400);
        }

        $allowedExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        $ext = strtolower($file->getClientOriginalExtension());

        if (! in_array($ext, $allowedExt, true)) {
            return response()->json(['error' => 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'], 400);
        }

        $uploadDir = (string) config('varman.uploads_dir');

        if (! is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $safeBase = preg_replace('/[^a-zA-Z0-9.-]/', '_', pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) ?: 'image';
        $safeBase = preg_replace('/_{2,}/', '_', $safeBase) ?: $safeBase;
        $filename = strtolower($safeBase.'_'.bin2hex(random_bytes(6)).'.'.$ext);

        $file->move($uploadDir, $filename);

        return response()->json([
            'success' => true,
            'filename' => $filename,
            'path' => rtrim((string) config('varman.uploads_url'), '/').'/'.$filename,
            'size' => $file->getSize(),
            'mimetype' => $file->getMimeType(),
        ]);
    }

    public function deleteUpload(string $filename): JsonResponse
    {
        if ($filename !== basename($filename) || str_contains($filename, '..') || str_contains($filename, '\\')) {
            return response()->json(['error' => 'Invalid filename'], 400);
        }

        $filePath = rtrim((string) config('varman.uploads_dir'), '/\\').DIRECTORY_SEPARATOR.$filename;

        if (! is_file($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        if (! unlink($filePath)) {
            return response()->json(['error' => 'Failed to delete image'], 500);
        }

        return response()->json(['success' => true, 'message' => 'Image deleted successfully']);
    }

    public function images(): JsonResponse
    {
        $allowedExt = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
        $assetsDir = (string) config('varman.assets_dir');
        $uploadDir = (string) config('varman.uploads_dir');
        $images = [];

        foreach ([$assetsDir, $uploadDir] as $dir) {
            if (! is_dir($dir)) {
                continue;
            }

            foreach (scandir($dir) ?: [] as $file) {
                if ($file === '.' || $file === '..') {
                    continue;
                }

                $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

                if (! in_array($ext, $allowedExt, true)) {
                    continue;
                }

                $filePath = rtrim($dir, '/\\').DIRECTORY_SEPARATOR.$file;

                if (! is_file($filePath)) {
                    continue;
                }

                $stat = stat($filePath);
                $images[] = [
                    'filename' => $file,
                    'path' => $dir === $uploadDir
                        ? '/assets/uploads/'.$file
                        : '/assets/'.$file,
                    'size' => $stat['size'],
                    'uploadedAt' => gmdate('c', (int) $stat['mtime']),
                ];
            }
        }

        usort($images, fn (array $a, array $b) => strtotime($b['uploadedAt']) <=> strtotime($a['uploadedAt']));

        return response()->json(['images' => $images]);
    }

    public function products(): JsonResponse
    {
        $products = DB::table('products')->get()->map(
            fn ($row) => $this->support->productFromRow((array) $row)
        )->values();

        return response()->json(['products' => $products]);
    }

    public function storeProduct(Request $request): JsonResponse
    {
        $data = $this->support->payload($request);
        $id = $this->support->sanitizeInput($data['id'] ?? '', 100);
        $name = $this->support->sanitizeInput($data['name'] ?? '', 200);

        if ($id === '' || $name === '') {
            return response()->json(['error' => 'Product ID and name required'], 400);
        }

        if (DB::table('products')->where('id', $id)->exists()) {
            return response()->json(['error' => 'Product ID already exists'], 400);
        }

        DB::table('products')->insert([
            'id' => $id,
            'icon' => $this->support->sanitizeInput($data['icon'] ?? 'box', 50),
            'name' => $name,
            'description' => $this->support->sanitizeInput($data['description'] ?? '', 2000),
            'specifications' => json_encode($this->support->normalizeList($data['specifications'] ?? [])),
            'uses' => json_encode($this->support->normalizeList($data['uses'] ?? [])),
            'advantages' => json_encode($this->support->normalizeList($data['advantages'] ?? [])),
            'unit' => $this->support->sanitizeInput($data['unit'] ?? 'per unit', 50),
            'image' => $this->support->sanitizeInput($data['image'] ?? './assets/default.webp', 200),
            'brands' => json_encode($this->support->normalizeList($data['brands'] ?? [])),
            'sizes' => json_encode(is_array($data['sizes'] ?? null) ? $data['sizes'] : []),
            'types' => json_encode(is_array($data['types'] ?? null) ? $data['types'] : []),
            'grades' => json_encode(is_array($data['grades'] ?? null) ? $data['grades'] : []),
            'active' => 1,
        ]);

        $product = DB::table('products')->where('id', $id)->first();

        return response()->json([
            'success' => true,
            'product' => $this->support->productFromRow((array) $product),
        ]);
    }

    public function updateProduct(Request $request, string $id): JsonResponse
    {
        $data = $this->support->payload($request);
        $product = DB::table('products')->where('id', $id)->first();

        if (! $product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $updates = [];
        $map = [
            'icon' => 50,
            'name' => 200,
            'description' => 2000,
            'unit' => 50,
            'image' => 200,
        ];

        foreach ($map as $field => $max) {
            if (array_key_exists($field, $data)) {
                $updates[$field] = $this->support->sanitizeInput($data[$field], $max);
            }
        }

        if (array_key_exists('active', $data)) {
            $updates['active'] = ! empty($data['active']) ? 1 : 0;
        }

        foreach (['specifications', 'uses', 'advantages', 'brands'] as $field) {
            if (array_key_exists($field, $data)) {
                $updates[$field] = json_encode($this->support->normalizeList($data[$field]));
            }
        }

        foreach (['sizes', 'types', 'grades'] as $field) {
            if (array_key_exists($field, $data)) {
                $updates[$field] = json_encode(is_array($data[$field]) ? $data[$field] : []);
            }
        }

        if ($updates === []) {
            return response()->json(['error' => 'No fields to update'], 400);
        }

        DB::table('products')->where('id', $id)->update($updates);
        $updated = DB::table('products')->where('id', $id)->first();

        return response()->json([
            'success' => true,
            'product' => $this->support->productFromRow((array) $updated),
        ]);
    }

    public function deleteProduct(string $id): JsonResponse
    {
        $deleted = DB::table('products')->where('id', $id)->delete();

        if ($deleted === 0) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        return response()->json(['success' => true, 'message' => 'Product deleted permanently']);
    }

    public function faqs(): JsonResponse
    {
        return response()->json(['faqs' => DB::table('faqs')->get()]);
    }

    public function storeFaq(Request $request): JsonResponse
    {
        $data = $this->support->payload($request);
        $question = $this->support->sanitizeInput($data['question'] ?? '', 300);
        $answer = $this->support->sanitizeInput($data['answer'] ?? '', 2000);
        $category = $this->support->sanitizeInput($data['category'] ?? 'general', 50);

        if ($question === '' || $answer === '') {
            return response()->json(['error' => 'Question and answer required'], 400);
        }

        $id = DB::table('faqs')->insertGetId([
            'question' => $question,
            'answer' => $answer,
            'category' => $category,
            'active' => 1,
        ]);

        return response()->json([
            'success' => true,
            'faq' => DB::table('faqs')->where('id', $id)->first(),
        ]);
    }

    public function updateFaq(Request $request, int $id): JsonResponse
    {
        $faq = DB::table('faqs')->where('id', $id)->first();

        if (! $faq) {
            return response()->json(['error' => 'FAQ not found'], 404);
        }

        $data = $this->support->payload($request);
        $updates = [];

        foreach (['question' => 300, 'answer' => 2000, 'category' => 50] as $field => $max) {
            if (array_key_exists($field, $data)) {
                $updates[$field] = $this->support->sanitizeInput($data[$field], $max);
            }
        }

        if (array_key_exists('active', $data)) {
            $updates['active'] = ! empty($data['active']) ? 1 : 0;
        }

        if ($updates === []) {
            return response()->json(['error' => 'No fields to update'], 400);
        }

        DB::table('faqs')->where('id', $id)->update($updates);

        return response()->json([
            'success' => true,
            'faq' => DB::table('faqs')->where('id', $id)->first(),
        ]);
    }

    public function deleteFaq(int $id): JsonResponse
    {
        $deleted = DB::table('faqs')->where('id', $id)->delete();

        if ($deleted === 0) {
            return response()->json(['error' => 'FAQ not found'], 404);
        }

        return response()->json(['success' => true, 'message' => 'FAQ deleted permanently']);
    }

    public function contacts(): JsonResponse
    {
        return response()->json([
            'contacts' => DB::table('contacts')->orderByDesc('id')->get(),
        ]);
    }

    public function updateContact(Request $request, int $id): JsonResponse
    {
        $contact = DB::table('contacts')->where('id', $id)->first();

        if (! $contact) {
            return response()->json(['error' => 'Contact not found'], 404);
        }

        $data = $this->support->payload($request);

        if (! array_key_exists('read', $data)) {
            return response()->json(['error' => 'No fields to update'], 400);
        }

        DB::table('contacts')->where('id', $id)->update([
            'read' => ! empty($data['read']) ? 1 : 0,
        ]);

        return response()->json([
            'success' => true,
            'contact' => DB::table('contacts')->where('id', $id)->first(),
        ]);
    }

    public function deleteContact(int $id): JsonResponse
    {
        $deleted = DB::table('contacts')->where('id', $id)->delete();

        if ($deleted === 0) {
            return response()->json(['error' => 'Contact not found'], 404);
        }

        return response()->json(['success' => true, 'message' => 'Contact deleted']);
    }

    public function quotes(): JsonResponse
    {
        $quotes = DB::table('quotes')->orderByDesc('id')->get()->map(function ($quote) {
            $row = (array) $quote;
            $row['materials'] = $this->support->decodeJsonArray($row['materials'] ?? null);

            return $row;
        })->values();

        return response()->json(['quotes' => $quotes]);
    }

    public function updateQuote(Request $request, int $id): JsonResponse
    {
        $quote = DB::table('quotes')->where('id', $id)->first();

        if (! $quote) {
            return response()->json(['error' => 'Quote not found'], 404);
        }

        $data = $this->support->payload($request);
        $updates = [];

        foreach (['status' => 100, 'timeline' => 100, 'project_details' => 2000, 'quantity' => 200] as $field => $max) {
            if (array_key_exists($field, $data)) {
                $updates[$field] = $this->support->sanitizeInput($data[$field], $max);
            }
        }

        if (array_key_exists('materials', $data)) {
            $materials = is_array($data['materials']) ? array_values($data['materials']) : [$data['materials']];
            $updates['materials'] = json_encode($materials);
        }

        if ($updates === []) {
            return response()->json(['error' => 'No fields to update'], 400);
        }

        DB::table('quotes')->where('id', $id)->update($updates);
        $updated = (array) DB::table('quotes')->where('id', $id)->first();
        $updated['materials'] = $this->support->decodeJsonArray($updated['materials'] ?? null);

        return response()->json(['success' => true, 'quote' => $updated]);
    }

    public function deleteQuote(int $id): JsonResponse
    {
        $deleted = DB::table('quotes')->where('id', $id)->delete();

        if ($deleted === 0) {
            return response()->json(['error' => 'Quote not found'], 404);
        }

        return response()->json(['success' => true, 'message' => 'Quote deleted']);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'products' => DB::table('products')->where('active', 1)->count(),
            'totalProducts' => DB::table('products')->count(),
            'faqs' => DB::table('faqs')->where('active', 1)->count(),
            'totalFaqs' => DB::table('faqs')->count(),
            'pendingQuotes' => DB::table('quotes')->where('status', 'pending')->count(),
            'unreadContacts' => DB::table('contacts')->where('read', 0)->count(),
            'totalContacts' => DB::table('contacts')->count(),
            'totalQuotes' => DB::table('quotes')->count(),
            'analytics' => $this->support->analytics(),
            'securityEvents' => DB::table('security_logs')->orderByDesc('id')->limit(50)->get(),
        ]);
    }

    // ─── Admin Users ───────────────────────────────────────────────────────────

    public function adminUsers(Request $request): JsonResponse
    {
        $users = DB::table('admin_users')
            ->select('id', 'username', 'name', 'email', 'role')
            ->get();

        return response()->json(['users' => $users]);
    }

    public function storeAdminUser(Request $request): JsonResponse
    {
        $data      = $this->support->payload($request);
        $username  = strtolower(trim((string) ($data['username'] ?? '')));
        $password  = (string) ($data['password'] ?? '');
        $name      = $this->support->sanitizeInput($data['name'] ?? '', 100);
        $email     = $this->support->sanitizeInput($data['email'] ?? '', 200);
        $role      = in_array($data['role'] ?? '', ['admin', 'editor'], true) ? $data['role'] : 'admin';

        if ($username === '' || $password === '') {
            return response()->json(['error' => 'Username and password required'], 400);
        }

        if (strlen($password) < 8) {
            return response()->json(['error' => 'Password must be at least 8 characters'], 400);
        }

        if (DB::table('admin_users')->where('username', $username)->exists()) {
            return response()->json(['error' => 'Username already exists'], 400);
        }

        $admin = $request->attributes->get('admin_user');
        $id = DB::table('admin_users')->insertGetId([
            'username'      => $username,
            'name'          => $name,
            'email'         => $email,
            'password_hash' => Hash::make($password),
            'role'          => $role,
        ]);

        $this->support->logActivity('create admin user', $admin['username'] ?? 'system', 'admin_user', (string) $id, "Created admin: {$username}", $this->support->getClientIp($request));

        return response()->json([
            'success' => true,
            'user'    => DB::table('admin_users')->select('id', 'username', 'name', 'email', 'role')->where('id', $id)->first(),
        ]);
    }

    public function updateAdminUser(Request $request, int $id): JsonResponse
    {
        $user = DB::table('admin_users')->where('id', $id)->first();

        if (! $user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $data    = $this->support->payload($request);
        $updates = [];

        if (isset($data['name'])) {
            $updates['name'] = $this->support->sanitizeInput($data['name'], 100);
        }

        if (isset($data['email'])) {
            $updates['email'] = $this->support->sanitizeInput($data['email'], 200);
        }

        if (isset($data['role']) && in_array($data['role'], ['admin', 'editor'], true)) {
            $updates['role'] = $data['role'];
        }

        if (! empty($data['password'])) {
            if (strlen((string) $data['password']) < 8) {
                return response()->json(['error' => 'Password must be at least 8 characters'], 400);
            }
            $updates['password_hash'] = Hash::make((string) $data['password']);
        }

        if ($updates === []) {
            return response()->json(['error' => 'No fields to update'], 400);
        }

        DB::table('admin_users')->where('id', $id)->update($updates);

        $admin = $request->attributes->get('admin_user');
        $this->support->logActivity('update admin user', $admin['username'] ?? 'system', 'admin_user', (string) $id, "Updated admin: {$user->username}", $this->support->getClientIp($request));

        return response()->json([
            'success' => true,
            'user'    => DB::table('admin_users')->select('id', 'username', 'name', 'email', 'role')->where('id', $id)->first(),
        ]);
    }

    public function deleteAdminUser(Request $request, int $id): JsonResponse
    {
        $admin = $request->attributes->get('admin_user');
        $currentUserId = (int) ($admin['id'] ?? 0);

        if ($currentUserId === $id) {
            return response()->json(['error' => 'Cannot delete your own account'], 400);
        }

        $user = DB::table('admin_users')->where('id', $id)->first();

        if (! $user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        DB::table('admin_users')->where('id', $id)->delete();

        $this->support->logActivity('delete admin user', $admin['username'] ?? 'system', 'admin_user', (string) $id, "Deleted admin: {$user->username}", $this->support->getClientIp($request));

        return response()->json(['success' => true, 'message' => 'Admin user deleted']);
    }

    // ─── CRM Leads ─────────────────────────────────────────────────────────────

    public function leads(Request $request): JsonResponse
    {
        $perPage = min((int) ($request->query('per_page', 15)), 100);
        $page    = max(1, (int) $request->query('page', 1));
        $status  = $request->query('status', '');
        $search  = trim((string) $request->query('search', ''));

        $query = DB::table('leads')->orderByDesc('id');

        if ($status !== '') {
            $query->where('status', $status);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%");
            });
        }

        $total = $query->count();
        $leads = $query->forPage($page, $perPage)->get();

        return response()->json([
            'leads' => [
                'data'  => $leads,
                'total' => $total,
            ],
        ]);
    }

    public function storeLead(Request $request): JsonResponse
    {
        $data = $this->support->payload($request);
        $name = $this->support->sanitizeInput($data['name'] ?? '', 100);

        if ($name === '') {
            return response()->json(['error' => 'Name required'], 400);
        }

        $id = DB::table('leads')->insertGetId([
            'name'       => $name,
            'email'      => $this->support->sanitizeInput($data['email'] ?? '', 200),
            'phone'      => $this->support->sanitizeInput($data['phone'] ?? '', 20),
            'company'    => $this->support->sanitizeInput($data['company'] ?? '', 200),
            'source'     => $this->support->sanitizeInput($data['source'] ?? '', 100),
            'status'     => in_array($data['status'] ?? '', ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'], true) ? $data['status'] : 'new',
            'notes'      => $this->support->sanitizeInput($data['notes'] ?? '', 2000),
            'value'      => is_numeric($data['value'] ?? null) ? (float) $data['value'] : null,
            'created_at' => $this->support->utcTimestamp(),
            'updated_at' => $this->support->utcTimestamp(),
        ]);

        $admin = $request->attributes->get('admin_user');
        $this->support->logActivity('create lead', $admin['username'] ?? 'system', 'lead', (string) $id, "Created lead: {$name}", $this->support->getClientIp($request));

        return response()->json(['success' => true, 'lead' => DB::table('leads')->where('id', $id)->first()]);
    }

    public function updateLead(Request $request, int $id): JsonResponse
    {
        $lead = DB::table('leads')->where('id', $id)->first();

        if (! $lead) {
            return response()->json(['error' => 'Lead not found'], 404);
        }

        $data    = $this->support->payload($request);
        $updates = ['updated_at' => $this->support->utcTimestamp()];

        foreach (['name' => 100, 'email' => 200, 'phone' => 20, 'company' => 200, 'source' => 100, 'notes' => 2000] as $field => $max) {
            if (array_key_exists($field, $data)) {
                $updates[$field] = $this->support->sanitizeInput($data[$field], $max);
            }
        }

        if (isset($data['status']) && in_array($data['status'], ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'], true)) {
            $updates['status'] = $data['status'];
        }

        if (array_key_exists('value', $data)) {
            $updates['value'] = is_numeric($data['value']) ? (float) $data['value'] : null;
        }

        DB::table('leads')->where('id', $id)->update($updates);

        $admin = $request->attributes->get('admin_user');
        $this->support->logActivity('update lead', $admin['username'] ?? 'system', 'lead', (string) $id, "Updated lead: {$lead->name}", $this->support->getClientIp($request));

        return response()->json(['success' => true, 'lead' => DB::table('leads')->where('id', $id)->first()]);
    }

    public function deleteLead(Request $request, int $id): JsonResponse
    {
        $lead = DB::table('leads')->where('id', $id)->first();

        if (! $lead) {
            return response()->json(['error' => 'Lead not found'], 404);
        }

        DB::table('leads')->where('id', $id)->delete();

        $admin = $request->attributes->get('admin_user');
        $this->support->logActivity('delete lead', $admin['username'] ?? 'system', 'lead', (string) $id, "Deleted lead: {$lead->name}", $this->support->getClientIp($request));

        return response()->json(['success' => true, 'message' => 'Lead deleted']);
    }

    // ─── Visitors ──────────────────────────────────────────────────────────────

    public function visitors(Request $request): JsonResponse
    {
        $perPage = min((int) ($request->query('per_page', 20)), 100);
        $page    = max(1, (int) $request->query('page', 1));
        $search  = trim((string) $request->query('search', ''));

        $query = DB::table('visitors')->orderByDesc('last_activity_at');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('ip_address', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        $total    = $query->count();
        $visitors = $query->forPage($page, $perPage)->get();

        return response()->json([
            'visitors' => [
                'data'  => $visitors,
                'total' => $total,
            ],
        ]);
    }

    public function visitorDetail(int $id): JsonResponse
    {
        $visitor = DB::table('visitors')->where('id', $id)->first();

        if (! $visitor) {
            return response()->json(['error' => 'Visitor not found'], 404);
        }

        $pageViews = DB::table('visitor_page_views')
            ->where('visitor_id', $id)
            ->orderByDesc('viewed_at')
            ->limit(50)
            ->get();

        return response()->json(['visitor' => $visitor, 'page_views' => $pageViews]);
    }

    // ─── Activity & Security Logs ──────────────────────────────────────────────

    public function activityLogs(Request $request): JsonResponse
    {
        $perPage = min((int) ($request->query('per_page', 30)), 100);
        $page    = max(1, (int) $request->query('page', 1));

        $total = DB::table('activity_logs')->count();
        $logs  = DB::table('activity_logs')
            ->orderByDesc('id')
            ->forPage($page, $perPage)
            ->get();

        return response()->json([
            'logs' => [
                'data'  => $logs,
                'total' => $total,
            ],
        ]);
    }

    public function securityLogs(Request $request): JsonResponse
    {
        $perPage = min((int) ($request->query('per_page', 30)), 100);
        $page    = max(1, (int) $request->query('page', 1));

        $total = DB::table('security_logs')->count();
        $logs  = DB::table('security_logs')
            ->orderByDesc('id')
            ->forPage($page, $perPage)
            ->get()
            ->map(fn ($row) => [
                'id'             => $row->id,
                'action'         => $row->type,
                'admin_username' => null,
                'ip_address'     => $row->ip,
                'description'    => trim("{$row->path} | {$row->user_agent}"),
                'severity'       => $row->severity,
                'created_at'     => $row->timestamp,
            ]);

        return response()->json([
            'logs' => [
                'data'  => $logs,
                'total' => $total,
            ],
        ]);
    }

    // ─── CMS Components (Site Editor) ─────────────────────────────────────────

    public function cmsComponents(): JsonResponse
    {
        $settings = DB::table('site_settings')
            ->where('group', 'like', 'component_%')
            ->get();

        $components = [];

        foreach ($settings as $s) {
            $componentKey = str_replace('component_', '', $s->group);
            $components[$componentKey][$s->key] = $s->value;
        }

        return response()->json(['components' => $components]);
    }

    public function updateCmsComponent(Request $request): JsonResponse
    {
        $data      = $this->support->payload($request);
        $component = $this->support->sanitizeInput($data['component'] ?? '', 100);
        $fields    = $data['data'] ?? [];

        if ($component === '' || ! is_array($fields)) {
            return response()->json(['error' => 'component and data required'], 400);
        }

        $group = 'component_'.$component;

        foreach ($fields as $key => $value) {
            $key   = $this->support->sanitizeInput((string) $key, 100);
            $value = is_array($value) ? json_encode($value) : $this->support->sanitizeInput((string) $value, 5000);

            if ($key === '') {
                continue;
            }

            $existing = DB::table('site_settings')->where('group', $group)->where('key', $key)->first();

            if ($existing) {
                DB::table('site_settings')->where('group', $group)->where('key', $key)->update(['value' => $value]);
            } else {
                DB::table('site_settings')->insert(['group' => $group, 'key' => $key, 'value' => $value, 'type' => 'text', 'label' => ucfirst(str_replace('_', ' ', $key))]);
            }
        }

        $admin = $request->attributes->get('admin_user');
        $this->support->logActivity('update component', $admin['username'] ?? 'system', 'component', $component, "Updated site component: {$component}", $this->support->getClientIp($request));

        return response()->json(['success' => true]);
    }

    // ─── CMS Settings ─────────────────────────────────────────────────────────

    public function cmsSettings(): JsonResponse
    {
        $settings = DB::table('site_settings')
            ->where('group', 'not like', 'component_%')
            ->get();

        return response()->json(['settings' => $settings]);
    }

    public function updateCmsSettings(Request $request): JsonResponse
    {
        $data     = $this->support->payload($request);
        $settings = $data['settings'] ?? [];

        if (! is_array($settings)) {
            return response()->json(['error' => 'settings must be an object'], 400);
        }

        foreach ($settings as $key => $value) {
            $key   = $this->support->sanitizeInput((string) $key, 100);
            $value = $this->support->sanitizeInput((string) $value, 5000);

            if ($key === '') {
                continue;
            }

            DB::table('site_settings')
                ->where('key', $key)
                ->where('group', 'not like', 'component_%')
                ->update(['value' => $value]);
        }

        $admin = $request->attributes->get('admin_user');
        $this->support->logActivity('update settings', $admin['username'] ?? 'system', 'settings', null, 'Updated site settings', $this->support->getClientIp($request));

        return response()->json(['success' => true]);
    }
}
