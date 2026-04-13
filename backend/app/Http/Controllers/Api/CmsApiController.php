<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\VarmanApiSupport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CmsApiController extends Controller
{
    public function __construct(private readonly VarmanApiSupport $support)
    {
    }

    // ==================== DASHBOARD ====================

    public function dashboard(Request $request): JsonResponse
    {
        $admin = $request->attributes->get('admin_user');
        $now = now();

        // Overview stats
        $totalVisitors = DB::table('visitor_sessions')->count();
        $todayVisitors = DB::table('visitor_sessions')
            ->whereDate('first_visit_at', $now->toDateString())
            ->count();
        $totalPageViews = DB::table('page_views')->count();
        $todayPageViews = DB::table('page_views')
            ->whereDate('viewed_at', $now->toDateString())
            ->count();

        $totalContacts = DB::table('contacts')->count();
        $unreadContacts = DB::table('contacts')->where('read', false)->count();
        $totalQuotes = DB::table('quotes')->count();
        $pendingQuotes = DB::table('quotes')->where('status', 'pending')->count();
        $totalLeads = DB::table('leads')->count();
        $activeLeads = DB::table('leads')->whereNotIn('status', ['won', 'lost'])->count();
        $totalProducts = DB::table('products')->count();
        $activeProducts = DB::table('products')->where('active', true)->count();

        // Visitor trend (last 30 days)
        $visitorTrend = DB::table('visitor_sessions')
            ->selectRaw("DATE(first_visit_at) as date, COUNT(*) as count")
            ->where('first_visit_at', '>=', $now->subDays(30)->toDateString())
            ->groupByRaw('DATE(first_visit_at)')
            ->orderBy('date')
            ->get();

        // Recent activity (with admin username)
        $recentActivity = DB::table('activity_logs')
            ->leftJoin('admin_users', 'activity_logs.admin_user_id', '=', 'admin_users.id')
            ->select('activity_logs.*', 'admin_users.username as admin_username')
            ->orderByDesc('activity_logs.created_at')
            ->limit(20)
            ->get();

        // Recent contacts
        $recentContacts = DB::table('contacts')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        // Recent quotes
        $recentQuotes = DB::table('quotes')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        // Device breakdown
        $deviceBreakdown = DB::table('visitor_sessions')
            ->selectRaw("device_type, COUNT(*) as count")
            ->groupBy('device_type')
            ->get();

        // Browser breakdown
        $browserBreakdown = DB::table('visitor_sessions')
            ->selectRaw("browser, COUNT(*) as count")
            ->whereNotNull('browser')
            ->groupBy('browser')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        // Top pages
        $topPages = DB::table('page_views')
            ->selectRaw("path, COUNT(*) as views")
            ->groupBy('path')
            ->orderByDesc('views')
            ->limit(10)
            ->get();

        // Country breakdown (GeoIP)
        $countryBreakdown = DB::table('visitor_sessions')
            ->selectRaw("country, country_code, COUNT(*) as count")
            ->whereNotNull('country')
            ->where('country', '!=', '')
            ->groupBy('country', 'country_code')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        // City breakdown (GeoIP)
        $cityBreakdown = DB::table('visitor_sessions')
            ->selectRaw("city, region, country, COUNT(*) as count")
            ->whereNotNull('city')
            ->where('city', '!=', '')
            ->groupBy('city', 'region', 'country')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        // Unread notifications
        $notifications = DB::table('notifications')
            ->where('is_read', false)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        // Flat counts for dashboard stat cards
        $totalPages = DB::table('cms_pages')->count();
        $totalFaqs = DB::table('faqs')->where('active', 1)->count();
        $unreadNotifications = DB::table('notifications')->where('is_read', false)->count();

        return response()->json([
            'overview' => [
                'visitors' => ['total' => $totalVisitors, 'today' => $todayVisitors],
                'page_views' => ['total' => $totalPageViews, 'today' => $todayPageViews],
                'contacts' => ['total' => $totalContacts, 'unread' => $unreadContacts],
                'quotes' => ['total' => $totalQuotes, 'pending' => $pendingQuotes],
                'leads' => ['total' => $totalLeads, 'active' => $activeLeads],
                'products' => ['total' => $totalProducts, 'active' => $activeProducts],
            ],
            'visitor_trend' => $visitorTrend,
            'recent_activity' => $recentActivity,
            'recent_contacts' => $recentContacts,
            'recent_quotes' => $recentQuotes,
            'device_breakdown' => $deviceBreakdown,
            'browser_breakdown' => $browserBreakdown,
            'top_pages' => $topPages,
            'country_breakdown' => $countryBreakdown,
            'city_breakdown' => $cityBreakdown,
            'notifications' => $notifications,
            'counts' => [
                'products' => $activeProducts,
                'contacts' => $totalContacts,
                'unread_contacts' => $unreadContacts,
                'quotes' => $totalQuotes,
                'pending_quotes' => $pendingQuotes,
                'visitors' => $totalVisitors,
                'today_visitors' => $todayVisitors,
                'page_views' => $totalPageViews,
                'leads' => $totalLeads,
                'active_leads' => $activeLeads,
                'pages' => $totalPages,
                'faqs' => $totalFaqs,
                'unread_notifications' => $unreadNotifications,
            ],
        ]);
    }

    // ==================== VISITOR / IP TRACKING ====================

    public function visitors(Request $request): JsonResponse
    {
        $perPage = min((int) ($request->query('per_page', 25)), 100);
        $page = max((int) ($request->query('page', 1)), 1);
        $search = $request->query('search', '');

        $query = DB::table('visitor_sessions')
            ->orderByDesc('last_activity_at');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('ip_address', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        $total = $query->count();
        $visitors = $query->offset(($page - 1) * $perPage)->limit($perPage)->get();

        return response()->json([
            'visitors' => $visitors,
            'pagination' => [
                'total' => $total,
                'per_page' => $perPage,
                'current_page' => $page,
                'last_page' => max(1, (int) ceil($total / $perPage)),
            ],
        ]);
    }

    public function visitorDetail(int $id): JsonResponse
    {
        $visitor = DB::table('visitor_sessions')->where('id', $id)->first();
        if (!$visitor) {
            return response()->json(['error' => 'Visitor not found'], 404);
        }

        $pageViews = DB::table('page_views')
            ->where('visitor_session_id', $id)
            ->orderByDesc('viewed_at')
            ->limit(100)
            ->get();

        return response()->json([
            'visitor' => $visitor,
            'page_views' => $pageViews,
        ]);
    }

    // ==================== ACTIVITY LOGS ====================

    public function activityLogs(Request $request): JsonResponse
    {
        $perPage = min((int) ($request->query('per_page', 50)), 200);
        $page = max((int) ($request->query('page', 1)), 1);

        $query = DB::table('activity_logs')->orderByDesc('created_at');
        $total = $query->count();
        $logs = $query->offset(($page - 1) * $perPage)->limit($perPage)->get();

        return response()->json([
            'logs' => $logs,
            'pagination' => [
                'total' => $total,
                'per_page' => $perPage,
                'current_page' => $page,
                'last_page' => max(1, (int) ceil($total / $perPage)),
            ],
        ]);
    }

    // ==================== CMS PAGES ====================

    public function pages(): JsonResponse
    {
        $pages = DB::table('cms_pages')->orderBy('sort_order')->get();
        return response()->json(['pages' => $pages]);
    }

    public function storePage(Request $request): JsonResponse
    {
        $data = $this->support->payload($request);
        $slug = $this->support->sanitizeInput($data['slug'] ?? '', 200);
        $title = $this->support->sanitizeInput($data['title'] ?? '', 300);

        if ($slug === '' || $title === '') {
            return response()->json(['error' => 'Slug and title required'], 400);
        }

        if (DB::table('cms_pages')->where('slug', $slug)->exists()) {
            return response()->json(['error' => 'Page slug already exists'], 400);
        }

        $admin = $request->attributes->get('admin_user');
        $id = DB::table('cms_pages')->insertGetId([
            'slug' => $slug,
            'title' => $title,
            'content' => $data['content'] ?? '',
            'meta' => json_encode($data['meta'] ?? []),
            'template' => $this->support->sanitizeInput($data['template'] ?? 'default', 100),
            'status' => in_array($data['status'] ?? 'draft', ['draft', 'published', 'archived']) ? $data['status'] : 'draft',
            'sort_order' => (int) ($data['sort_order'] ?? 0),
            'created_by' => $admin['id'] ?? null,
            'updated_by' => $admin['id'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->logActivity($request, 'create', 'page', $id, "Created page: {$title}");
        return response()->json(['success' => true, 'page' => DB::table('cms_pages')->find($id)]);
    }

    public function updatePage(Request $request, int $id): JsonResponse
    {
        $page = DB::table('cms_pages')->find($id);
        if (!$page) {
            return response()->json(['error' => 'Page not found'], 404);
        }

        $data = $this->support->payload($request);
        $updates = [];

        if (isset($data['title'])) $updates['title'] = $this->support->sanitizeInput($data['title'], 300);
        if (isset($data['content'])) $updates['content'] = $data['content'];
        if (isset($data['meta'])) $updates['meta'] = json_encode($data['meta']);
        if (isset($data['template'])) $updates['template'] = $this->support->sanitizeInput($data['template'], 100);
        if (isset($data['status'])) $updates['status'] = in_array($data['status'], ['draft', 'published', 'archived']) ? $data['status'] : $page->status;
        if (isset($data['sort_order'])) $updates['sort_order'] = (int) $data['sort_order'];

        $admin = $request->attributes->get('admin_user');
        $updates['updated_by'] = $admin['id'] ?? null;
        $updates['updated_at'] = now();

        DB::table('cms_pages')->where('id', $id)->update($updates);
        $this->logActivity($request, 'update', 'page', $id, "Updated page: {$page->title}");

        return response()->json(['success' => true, 'page' => DB::table('cms_pages')->find($id)]);
    }

    public function deletePage(int $id, Request $request): JsonResponse
    {
        $page = DB::table('cms_pages')->find($id);
        if (!$page) {
            return response()->json(['error' => 'Page not found'], 404);
        }

        DB::table('cms_pages')->where('id', $id)->delete();
        $this->logActivity($request, 'delete', 'page', $id, "Deleted page: {$page->title}");

        return response()->json(['success' => true]);
    }

    // ==================== SITE SETTINGS ====================

    public function settings(): JsonResponse
    {
        $settings = DB::table('site_settings')->orderBy('group')->orderBy('key')->get();
        $grouped = [];
        foreach ($settings as $s) {
            $grouped[$s->group][] = $s;
        }
        return response()->json(['settings' => $grouped, 'all' => $settings]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $data = $this->support->payload($request);
        $settings = $data['settings'] ?? [];

        foreach ($settings as $item) {
            $key = $this->support->sanitizeInput($item['key'] ?? '', 100);
            if ($key === '') continue;

            $group = $this->support->sanitizeInput($item['group'] ?? 'general', 50);
            DB::table('site_settings')->updateOrInsert(
                ['key' => $key, 'group' => $group],
                [
                    'value' => $item['value'] ?? '',
                    'type' => $item['type'] ?? 'text',
                    'label' => $this->support->sanitizeInput($item['label'] ?? '', 200),
                    'updated_at' => now(),
                ]
            );
        }

        $this->logActivity($request, 'update', 'settings', null, 'Updated site settings');
        return response()->json(['success' => true]);
    }

    // ==================== COMPONENT CONTENT (SITE EDITOR) ====================

    public function components(): JsonResponse
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

    public function updateComponent(Request $request): JsonResponse
    {
        $data = $this->support->payload($request);
        $component = $this->support->sanitizeInput($data['component'] ?? '', 50);
        $fields = $data['data'] ?? [];

        if ($component === '') {
            return response()->json(['error' => 'Component name required'], 422);
        }

        $group = 'component_' . $component;

        foreach ($fields as $key => $value) {
            $safeKey = $this->support->sanitizeInput($key, 100);
            if ($safeKey === '') continue;

            DB::table('site_settings')->updateOrInsert(
                ['key' => $safeKey, 'group' => $group],
                [
                    'value' => is_string($value) ? $value : json_encode($value),
                    'type' => 'text',
                    'label' => ucfirst(str_replace('_', ' ', $safeKey)),
                    'updated_at' => now(),
                ]
            );
        }

        $this->logActivity($request, 'update', 'component', null, "Updated {$component} component content");
        return response()->json(['success' => true]);
    }

    // ==================== LEADS (CRM) ====================

    public function leads(Request $request): JsonResponse
    {
        $perPage = min((int) ($request->query('per_page', 25)), 100);
        $page = max((int) ($request->query('page', 1)), 1);
        $status = $request->query('status', '');

        $query = DB::table('leads')->orderByDesc('created_at');
        if ($status) {
            $query->where('status', $status);
        }

        $total = $query->count();
        $leads = $query->offset(($page - 1) * $perPage)->limit($perPage)->get();

        return response()->json([
            'leads' => $leads,
            'pagination' => [
                'total' => $total,
                'per_page' => $perPage,
                'current_page' => $page,
                'last_page' => max(1, (int) ceil($total / $perPage)),
            ],
        ]);
    }

    public function storeLead(Request $request): JsonResponse
    {
        $data = $this->support->payload($request);
        $name = $this->support->sanitizeInput($data['name'] ?? '', 150);

        if ($name === '') {
            return response()->json(['error' => 'Lead name required'], 400);
        }

        $id = DB::table('leads')->insertGetId([
            'name' => $name,
            'email' => $this->support->sanitizeInput($data['email'] ?? '', 200) ?: null,
            'phone' => $this->support->sanitizeInput($data['phone'] ?? '', 30) ?: null,
            'source' => in_array($data['source'] ?? 'website', ['website', 'whatsapp', 'phone', 'referral', 'social']) ? $data['source'] : 'website',
            'status' => 'new',
            'priority' => in_array($data['priority'] ?? 'medium', ['low', 'medium', 'high', 'urgent']) ? $data['priority'] : 'medium',
            'notes' => $this->support->sanitizeInput($data['notes'] ?? '', 5000) ?: null,
            'assigned_to' => $this->support->sanitizeInput($data['assigned_to'] ?? '', 100) ?: null,
            'estimated_value' => is_numeric($data['estimated_value'] ?? null) ? (float) $data['estimated_value'] : null,
            'project_type' => $this->support->sanitizeInput($data['project_type'] ?? '', 100) ?: null,
            'location' => $this->support->sanitizeInput($data['location'] ?? '', 200) ?: null,
            'tags' => json_encode($data['tags'] ?? []),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->logActivity($request, 'create', 'lead', $id, "Created lead: {$name}");
        return response()->json(['success' => true, 'lead' => DB::table('leads')->find($id)]);
    }

    public function updateLead(Request $request, int $id): JsonResponse
    {
        $lead = DB::table('leads')->find($id);
        if (!$lead) {
            return response()->json(['error' => 'Lead not found'], 404);
        }

        $data = $this->support->payload($request);
        $updates = [];

        if (isset($data['name'])) $updates['name'] = $this->support->sanitizeInput($data['name'], 150);
        if (isset($data['email'])) $updates['email'] = $this->support->sanitizeInput($data['email'], 200) ?: null;
        if (isset($data['phone'])) $updates['phone'] = $this->support->sanitizeInput($data['phone'], 30) ?: null;
        if (isset($data['source'])) $updates['source'] = in_array($data['source'], ['website', 'whatsapp', 'phone', 'referral', 'social']) ? $data['source'] : $lead->source;
        if (isset($data['status'])) $updates['status'] = in_array($data['status'], ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']) ? $data['status'] : $lead->status;
        if (isset($data['priority'])) $updates['priority'] = in_array($data['priority'], ['low', 'medium', 'high', 'urgent']) ? $data['priority'] : $lead->priority;
        if (isset($data['notes'])) $updates['notes'] = $this->support->sanitizeInput($data['notes'], 5000) ?: null;
        if (isset($data['assigned_to'])) $updates['assigned_to'] = $this->support->sanitizeInput($data['assigned_to'], 100) ?: null;
        if (isset($data['estimated_value'])) $updates['estimated_value'] = is_numeric($data['estimated_value']) ? (float) $data['estimated_value'] : null;
        if (isset($data['project_type'])) $updates['project_type'] = $this->support->sanitizeInput($data['project_type'], 100) ?: null;
        if (isset($data['location'])) $updates['location'] = $this->support->sanitizeInput($data['location'], 200) ?: null;
        if (isset($data['tags'])) $updates['tags'] = json_encode($data['tags']);
        if (isset($data['last_contacted_at'])) $updates['last_contacted_at'] = $data['last_contacted_at'];

        $updates['updated_at'] = now();
        DB::table('leads')->where('id', $id)->update($updates);
        $this->logActivity($request, 'update', 'lead', $id, "Updated lead: {$lead->name}");

        return response()->json(['success' => true, 'lead' => DB::table('leads')->find($id)]);
    }

    public function deleteLead(int $id, Request $request): JsonResponse
    {
        $lead = DB::table('leads')->find($id);
        if (!$lead) {
            return response()->json(['error' => 'Lead not found'], 404);
        }

        DB::table('leads')->where('id', $id)->delete();
        $this->logActivity($request, 'delete', 'lead', $id, "Deleted lead: {$lead->name}");

        return response()->json(['success' => true]);
    }

    // ==================== NOTIFICATIONS ====================

    public function notifications(Request $request): JsonResponse
    {
        $notifications = DB::table('notifications')
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        return response()->json(['notifications' => $notifications]);
    }

    public function markNotificationRead(int $id): JsonResponse
    {
        DB::table('notifications')->where('id', $id)->update(['is_read' => true]);
        return response()->json(['success' => true]);
    }

    public function markAllNotificationsRead(): JsonResponse
    {
        DB::table('notifications')->where('is_read', false)->update(['is_read' => true]);
        return response()->json(['success' => true]);
    }

    // ==================== SECURITY LOGS ====================

    public function securityLogs(Request $request): JsonResponse
    {
        $perPage = min((int) ($request->query('per_page', 50)), 200);
        $page = max((int) ($request->query('page', 1)), 1);

        $total = DB::table('security_logs')->count();
        $logs = DB::table('security_logs')
            ->orderByDesc('timestamp')
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get();

        return response()->json([
            'logs' => $logs,
            'pagination' => [
                'total' => $total,
                'per_page' => $perPage,
                'current_page' => $page,
                'last_page' => max(1, (int) ceil($total / $perPage)),
            ],
        ]);
    }

    // ==================== HELPERS ====================

    private function logActivity(Request $request, string $action, string $entityType, mixed $entityId, string $description, ?array $oldValues = null, ?array $newValues = null): void
    {
        try {
            $admin = $request->attributes->get('admin_user');
            DB::table('activity_logs')->insert([
                'admin_user_id' => $admin['id'] ?? null,
                'action' => $action,
                'entity_type' => $entityType,
                'entity_id' => $entityId !== null ? (string) $entityId : null,
                'description' => $description,
                'old_values' => $oldValues ? json_encode($oldValues) : null,
                'new_values' => $newValues ? json_encode($newValues) : null,
                'ip_address' => $this->support->getClientIp($request),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);
        } catch (\Throwable $e) {
            // Silent fail for logging
        }
    }
}
