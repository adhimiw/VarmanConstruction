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
            'role' => $admin->role,
            'iat' => time(),
            'exp' => time() + (int) config('varman.jwt_exp', 86400),
        ];

        $token = $this->support->issueToken($payload);

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => [
                'username' => $admin->username,
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
                        ? rtrim((string) config('varman.uploads_url'), '/').'/'.$file
                        : './assets/'.$file,
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
}
