<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\VarmanApiSupport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PublicApiController extends Controller
{
    public function __construct(private readonly VarmanApiSupport $support)
    {
    }

    public function root(): JsonResponse
    {
        return response()->json(['status' => 'ok', 'message' => 'API is running']);
    }

    public function health(): JsonResponse
    {
        return response()->json(['status' => 'ok', 'timestamp' => $this->support->utcTimestamp()]);
    }

    public function products(): JsonResponse
    {
        $preferredOrder = [
            'm_sand',
            'p_sand',
            'blue_metal',
            'red_bricks',
            'fly_ash_bricks',
            'concrete_blocks',
            'cement',
            'aac_blocks',
            'size_stone',
        ];

        // Build CASE-based ordering (works in both MySQL and SQLite)
        $cases = collect($preferredOrder)->map(fn ($id, $i) => "WHEN id = '{$id}' THEN {$i}")->implode(' ');
        $orderSql = "CASE {$cases} ELSE " . count($preferredOrder) . " END";
        $rows = DB::table('products')
            ->where('active', 1)
            ->orderByRaw($orderSql)
            ->get()
            ->map(
            fn ($row) => $this->support->productFromRow((array) $row)
        )->values();

        return response()->json(['products' => $rows]);
    }

    public function product(string $id): JsonResponse
    {
        $row = DB::table('products')->where('id', $id)->where('active', 1)->first();

        if (! $row) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        return response()->json(['product' => $this->support->productFromRow((array) $row)]);
    }

    public function faqs(): JsonResponse
    {
        return response()->json([
            'faqs' => DB::table('faqs')->where('active', 1)->get(),
        ]);
    }

    public function contact(Request $request): JsonResponse
    {
        $ip = $this->support->getClientIp($request);

        if (! $this->support->checkRateLimit('contact:'.$ip, 10, 3600)) {
            return response()->json(['error' => 'Too many submissions, please try again later.'], 429);
        }

        $data = $this->support->payload($request);
        $name = $this->support->sanitizeInput($data['name'] ?? '', 100);
        $email = $this->support->sanitizeInput($data['email'] ?? '', 200);
        $phone = $this->support->sanitizeInput($data['phone'] ?? '', 20);
        $material = $this->support->sanitizeInput($data['material'] ?? 'Not specified', 100);
        $message = $this->support->sanitizeInput($data['message'] ?? '', 2000);
        $projectLocation = $this->support->sanitizeInput($data['project_location'] ?? 'Not specified', 200);

        if ($name === '' || $email === '' || $phone === '' || $message === '') {
            return response()->json(['error' => 'Required fields missing'], 400);
        }

        DB::table('contacts')->insert([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'material' => $material !== '' ? $material : 'Not specified',
            'message' => $message,
            'project_location' => $projectLocation,
            'created_at' => $this->support->utcTimestamp(),
            'read' => 0,
        ]);

        $adminNumber = (string) config('varman.admin_whatsapp', '919944508736');
        $defaultCountryCode = (string) config('varman.default_country_code', '91');
        $userNumber = $this->support->normalizePhone($phone, $defaultCountryCode);

        $whatsappAdminMessage = "New Contact Form Submission!\n\n*Customer Details:*\nName: {$name}\nEmail: {$email}\nPhone: {$phone}\nMaterial: {$material}\nProject Location: {$projectLocation}\n\n*Message:*\n{$message}\n\nPlease follow up promptly.";
        $whatsappAdminUrl = 'https://wa.me/'.$adminNumber.'?text='.rawurlencode($whatsappAdminMessage);

        $whatsappUserMessage = "Hi {$name}, thanks for contacting VARMAN CONSTRUCTIONS! We received your inquiry for {$material}.\n\nWe will contact you shortly with details. If urgent, you can reply here.\n\nReference: ".gmdate('Ymd-His');
        $whatsappUserUrl = $userNumber !== '' ? 'https://wa.me/'.$userNumber.'?text='.rawurlencode($whatsappUserMessage) : '';

        $adminEmailHtml = $this->support->buildAdminNotificationEmail(
            'New Contact Form Submission',
            [
                'Name' => $name,
                'Email' => $email,
                'Phone' => $phone,
                'Material' => $material,
                'Project Location' => $projectLocation,
            ],
            $message
        );
        $emailSentAdmin = $this->support->sendEmailNotification('New Contact Form - Varman Constructions', $adminEmailHtml, null, true);

        $reference = gmdate('Ymd-His');
        $userEmailHtml = $this->support->buildClientThankYouEmail($name, $material, $projectLocation, $message, $reference);
        $emailSentUser = $this->support->sendEmailNotification('Thank you for contacting Varman Constructions', $userEmailHtml, $email, true);

        return response()->json([
            'success' => true,
            'message' => 'Contact form submitted successfully',
            'whatsapp_url' => $whatsappAdminUrl,
            'whatsapp_admin_url' => $whatsappAdminUrl,
            'whatsapp_user_url' => $whatsappUserUrl,
            'email_sent_admin' => $emailSentAdmin,
            'email_sent_user' => $emailSentUser,
        ]);
    }

    public function quote(Request $request): JsonResponse
    {
        $ip = $this->support->getClientIp($request);

        if (! $this->support->checkRateLimit('quote:'.$ip, 10, 3600)) {
            return response()->json(['error' => 'Too many submissions, please try again later.'], 429);
        }

        $data = $this->support->payload($request);
        $name = $this->support->sanitizeInput($data['name'] ?? '', 100);
        $email = $this->support->sanitizeInput($data['email'] ?? '', 200);
        $phone = $this->support->sanitizeInput($data['phone'] ?? '', 20);
        $materials = $data['materials'] ?? [];
        $materials = is_array($materials) ? array_values($materials) : [$materials];
        $quantity = $this->support->sanitizeInput($data['quantity'] ?? '', 200);
        $projectDetails = $this->support->sanitizeInput($data['project_details'] ?? '', 2000);
        $timeline = $this->support->sanitizeInput($data['timeline'] ?? 'Not specified', 100);

        if ($name === '' || $email === '' || $phone === '' || $materials === [] || $quantity === '') {
            return response()->json(['error' => 'Required fields missing'], 400);
        }

        DB::table('quotes')->insert([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'materials' => json_encode($materials),
            'quantity' => $quantity,
            'project_details' => $projectDetails,
            'timeline' => $timeline,
            'created_at' => $this->support->utcTimestamp(),
            'status' => 'pending',
        ]);

        $materialsList = implode(', ', $materials);
        $whatsappMessage = "Hello Varman Constructions!\n\nI need a quotation for building materials.\n\n*My Details:*\nName: {$name}\nEmail: {$email}\nPhone: {$phone}\n\n*Requirements:*\nMaterials: {$materialsList}\nQuantity: {$quantity}\nTimeline: {$timeline}\n\n*Project Details:*\n{$projectDetails}";
        $whatsappUrl = 'https://wa.me/'.config('varman.admin_whatsapp', '917708484811').'?text='.rawurlencode($whatsappMessage);

        $emailHtml = $this->support->buildAdminNotificationEmail(
            'New Quote Request',
            [
                'Name' => $name,
                'Email' => $email,
                'Phone' => $phone,
                'Materials' => $materialsList,
                'Quantity' => $quantity,
                'Timeline' => $timeline,
            ],
            $projectDetails
        );
        $emailSent = $this->support->sendEmailNotification('New Quote Request - Varman Constructions', $emailHtml, null, true);

        return response()->json([
            'success' => true,
            'message' => 'Quote request submitted successfully',
            'whatsapp_url' => $whatsappUrl,
            'email_sent' => $emailSent,
        ]);
    }

    public function analyticsTrack(Request $request): JsonResponse
    {
        $data = $this->support->payload($request);
        $type = $data['type'] ?? '';

        if ($type === 'view') {
            $date     = $this->support->utcDate();
            $existing = DB::table('analytics_views')->where('date', $date)->first();

            if ($existing) {
                DB::table('analytics_views')->where('date', $date)->update(['views' => (int) $existing->views + 1]);
            } else {
                DB::table('analytics_views')->insert(['date' => $date, 'views' => 1]);
            }

            // Track individual visitor session
            $path  = $this->support->sanitizeInput((string) ($data['path'] ?? '/'), 500);
            $title = $this->support->sanitizeInput((string) ($data['title'] ?? ''), 300);
            $this->support->trackVisitor($request, $path, $title);

        } elseif ($type === 'click' && ! empty($data['element'])) {
            $element  = $this->support->sanitizeInput((string) $data['element'], 100);
            $existing = DB::table('analytics_clicks')->where('element', $element)->first();

            if ($existing) {
                DB::table('analytics_clicks')->where('element', $element)->update(['count' => (int) $existing->count + 1]);
            } else {
                DB::table('analytics_clicks')->insert(['element' => $element, 'count' => 1]);
            }
        }

        return response()->json(['success' => true]);
    }

    public function securityAlert(Request $request): JsonResponse
    {
        $data = $this->support->payload($request);
        $type = $this->support->sanitizeInput($data['type'] ?? 'SUSPICIOUS_ACTIVITY', 100);
        $path = $this->support->sanitizeInput($data['path'] ?? 'unknown', 200);
        $userAgent = $this->support->sanitizeInput($data['userAgent'] ?? $request->userAgent() ?? '', 300);
        $ip = $this->support->sanitizeInput($data['ip'] ?? $this->support->getClientIp($request), 100);

        $this->support->logSecurityEvent($type, $path, $ip, $userAgent, 'HIGH');

        return response()->json(['success' => true, 'fakeToken' => '8d9a8f9a8d9a8f...']);
    }

    public function siteContent(): JsonResponse
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
}
