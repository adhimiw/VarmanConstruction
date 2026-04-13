<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedContacts();
        $this->seedQuotes();
        $this->seedLeads();
        $this->seedVisitorSessions();
        $this->seedPageViews();
        $this->seedActivityLogs();
        $this->seedCmsPages();
        $this->seedSiteSettings();
        $this->seedComponentContent();
        $this->seedSecurityLogs();
        $this->seedAnalytics();
        $this->seedNotifications();
    }

    private function seedContacts(): void
    {
        if (DB::table('contacts')->count() > 0) return;

        $contacts = [
            ['name' => 'Rajesh Kumar', 'email' => 'rajesh.kumar@gmail.com', 'phone' => '+91 98765 43210', 'material' => 'M-Sand', 'message' => 'I need 50 units of M-Sand for my residential project in Coimbatore. Please share best pricing and delivery timeline.', 'project_location' => 'Coimbatore', 'created_at' => '2026-04-12 09:15:00', 'read' => false],
            ['name' => 'Priya Natarajan', 'email' => 'priya.n@yahoo.com', 'phone' => '+91 87654 32109', 'material' => 'Blue Metal', 'message' => 'Looking for 20mm blue metal aggregate for road construction project. Quantity: approximately 200 tons. Need delivery to Madurai district.', 'project_location' => 'Madurai', 'created_at' => '2026-04-12 07:30:00', 'read' => false],
            ['name' => 'Mohammed Ashraf', 'email' => 'ashraf.builder@outlook.com', 'phone' => '+91 76543 21098', 'material' => 'Cement', 'message' => 'We are a construction company and need regular supply of UltraTech OPC 53 grade cement. Monthly requirement is around 500 bags. Please share wholesale rates.', 'project_location' => 'Tiruppur', 'created_at' => '2026-04-11 16:45:00', 'read' => false],
            ['name' => 'Lakshmi Devi', 'email' => 'lakshmi.devi@gmail.com', 'phone' => '+91 65432 10987', 'material' => 'Red Bricks', 'message' => 'Need 10,000 red bricks for house construction. When can you deliver to Dindigul? What is the price per brick?', 'project_location' => 'Dindigul', 'created_at' => '2026-04-11 14:20:00', 'read' => true],
            ['name' => 'Senthil Murugan', 'email' => 'senthil.m@hotmail.com', 'phone' => '+91 54321 09876', 'material' => 'AAC Blocks', 'message' => 'Building a 3-story commercial complex. Need AAC blocks 600x200x200mm. Please provide quotation for 5000 blocks including delivery charges.', 'project_location' => 'Tirunelveli', 'created_at' => '2026-04-11 11:00:00', 'read' => true],
            ['name' => 'Anitha Balakrishnan', 'email' => 'anitha.bk@gmail.com', 'phone' => '+91 43210 98765', 'material' => 'P-Sand', 'message' => 'Required P-Sand for plastering work on a villa project. Approximately 30 units needed. Need delivery within this week.', 'project_location' => 'Coimbatore', 'created_at' => '2026-04-10 15:30:00', 'read' => true],
            ['name' => 'Vijay Shankar', 'email' => 'vijay.shankar@company.com', 'phone' => '+91 32109 87654', 'material' => 'Fly Ash Bricks', 'message' => 'We need fly ash bricks for our apartment construction. 25,000 pieces. Can you deliver to Thoothukudi?', 'project_location' => 'Thoothukudi', 'created_at' => '2026-04-10 10:15:00', 'read' => true],
            ['name' => 'Kavitha Ramasamy', 'email' => 'kavitha.r@gmail.com', 'phone' => '+91 21098 76543', 'material' => 'Concrete Blocks', 'message' => 'Need hollow concrete blocks for boundary wall construction. Around 1000 pieces. What sizes are available?', 'project_location' => 'Kanyakumari', 'created_at' => '2026-04-09 13:45:00', 'read' => true],
            ['name' => 'Suresh Babu', 'email' => 'suresh.babu@builders.in', 'phone' => '+91 10987 65432', 'material' => 'M-Sand', 'message' => 'Looking for regular M-Sand supply for ongoing apartment project. Monthly requirement 100 units. Please share contract pricing.', 'project_location' => 'Madurai', 'created_at' => '2026-04-08 09:00:00', 'read' => true],
            ['name' => 'Deepa Krishnan', 'email' => 'deepa.k@yahoo.com', 'phone' => '+91 98123 45678', 'material' => 'Size Stone', 'message' => 'Need size stone for foundation work. House construction in Coimbatore rural area. Please advise on availability.', 'project_location' => 'Coimbatore', 'created_at' => '2026-04-07 17:20:00', 'read' => true],
            ['name' => 'Karthik Vel', 'email' => 'karthik.vel@infra.com', 'phone' => '+91 87612 34567', 'material' => 'Blue Metal', 'message' => 'Urgent requirement for 40mm blue metal for highway project near Tiruppur. Need 500 tons. Please confirm stock and rate.', 'project_location' => 'Tiruppur', 'created_at' => '2026-04-06 08:30:00', 'read' => true],
            ['name' => 'Meenakshi Sundaram', 'email' => 'meena.s@gmail.com', 'phone' => '+91 76512 34567', 'material' => 'Cement', 'message' => 'Need Ramco PPC cement for plastering. Around 200 bags. Delivery to Dindigul. What is the current rate?', 'project_location' => 'Dindigul', 'created_at' => '2026-04-05 12:00:00', 'read' => true],
        ];

        DB::table('contacts')->insert($contacts);
    }

    private function seedQuotes(): void
    {
        if (DB::table('quotes')->count() > 0) return;

        $quotes = [
            ['name' => 'Arun Prakash', 'email' => 'arun.prakash@constructions.in', 'phone' => '+91 99887 76655', 'materials' => json_encode(['M-Sand', 'Blue Metal', 'Cement']), 'quantity' => 'M-Sand: 100 units, Blue Metal 20mm: 50 tons, Cement: 300 bags', 'project_details' => 'Residential apartment complex - 48 units, 4 floors. Foundation and structural work starting next month.', 'timeline' => '2 weeks', 'created_at' => '2026-04-12 08:00:00', 'status' => 'pending'],
            ['name' => 'Bharathi Construction Pvt Ltd', 'email' => 'procurement@bharathi.com', 'phone' => '+91 98776 55443', 'materials' => json_encode(['AAC Blocks', 'Cement', 'M-Sand']), 'quantity' => 'AAC Blocks: 10000 pcs, Cement: 1000 bags, M-Sand: 200 units', 'project_details' => 'Commercial mall construction in Coimbatore. Phase 2 starting soon. Need bulk pricing with monthly delivery schedule.', 'timeline' => '1 month', 'created_at' => '2026-04-11 14:30:00', 'status' => 'pending'],
            ['name' => 'Ganesh Builders', 'email' => 'ganesh.builders@gmail.com', 'phone' => '+91 97665 44332', 'materials' => json_encode(['Red Bricks', 'P-Sand', 'Cement']), 'quantity' => 'Red Bricks: 50000 pcs, P-Sand: 40 units, Cement: 200 bags', 'project_details' => 'Row house project with 20 individual houses. Need phased delivery over 3 months.', 'timeline' => '3 months', 'created_at' => '2026-04-10 11:00:00', 'status' => 'pending'],
            ['name' => 'Tamil Infrastructure Corp', 'email' => 'info@tamilinfra.com', 'phone' => '+91 96554 33221', 'materials' => json_encode(['Blue Metal', 'M-Sand']), 'quantity' => 'Blue Metal 40mm: 300 tons, Blue Metal 20mm: 200 tons, M-Sand: 500 units', 'project_details' => 'Government road project NH44 bypass. 12km stretch. Need consistent quality supply.', 'timeline' => 'Immediate', 'created_at' => '2026-04-09 09:30:00', 'status' => 'reviewed'],
            ['name' => 'Manoj Kumar', 'email' => 'manoj.k.home@gmail.com', 'phone' => '+91 95443 22110', 'materials' => json_encode(['Fly Ash Bricks', 'Cement', 'M-Sand', 'P-Sand']), 'quantity' => 'Fly Ash Bricks: 15000 pcs, Cement: 150 bags, M-Sand: 30 units, P-Sand: 15 units', 'project_details' => 'Individual house construction 2400 sq ft. Ground + First floor. Starting plinth work.', 'timeline' => '1 week', 'created_at' => '2026-04-08 16:15:00', 'status' => 'approved'],
            ['name' => 'Sri Murugan Constructions', 'email' => 'sri.murugan@builders.com', 'phone' => '+91 94332 11009', 'materials' => json_encode(['Concrete Blocks', 'Cement']), 'quantity' => 'Concrete Blocks: 5000 pcs, Cement: 400 bags', 'project_details' => 'Industrial warehouse construction in SIPCOT Madurai. Boundary wall and main structure.', 'timeline' => '2 weeks', 'created_at' => '2026-04-07 10:00:00', 'status' => 'approved'],
            ['name' => 'Revathi Engineers', 'email' => 'purchase@revathi-eng.com', 'phone' => '+91 93221 00998', 'materials' => json_encode(['Size Stone', 'Blue Metal', 'M-Sand']), 'quantity' => 'Size Stone: 2000 pcs, Blue Metal 12mm: 100 tons, M-Sand: 80 units', 'project_details' => 'Bridge foundation reinforcement work on Cauvery river. Government contract.', 'timeline' => 'Immediate', 'created_at' => '2026-04-05 14:00:00', 'status' => 'completed'],
            ['name' => 'Durga Homes', 'email' => 'durga.homes@yahoo.com', 'phone' => '+91 92110 99887', 'materials' => json_encode(['M-Sand', 'Cement', 'Red Bricks', 'P-Sand']), 'quantity' => 'M-Sand: 60 units, Cement: 250 bags, Red Bricks: 20000 pcs, P-Sand: 25 units', 'project_details' => 'Villa project - 5 individual villas in Pollachi. Quality is top priority.', 'timeline' => '1 month', 'created_at' => '2026-04-03 09:45:00', 'status' => 'completed'],
        ];

        DB::table('quotes')->insert($quotes);
    }

    private function seedLeads(): void
    {
        if (DB::table('leads')->count() > 0) return;

        $leads = [
            ['name' => 'Arjun Developers Pvt Ltd', 'email' => 'arjun.dev@company.com', 'phone' => '+91 99001 22334', 'source' => 'website', 'status' => 'new', 'priority' => 'high', 'notes' => 'Large developer from Chennai looking to set up regular supply chain for Coimbatore projects. Very high potential.', 'assigned_to' => 'Varman', 'estimated_value' => 2500000.00, 'project_type' => 'Residential Complex', 'location' => 'Coimbatore', 'tags' => json_encode(['bulk-order', 'residential', 'high-value']), 'last_contacted_at' => null, 'created_at' => now()->subHours(2), 'updated_at' => now()->subHours(2)],
            ['name' => 'Kumaran Constructions', 'email' => 'kumaran@constructions.in', 'phone' => '+91 88990 11223', 'source' => 'phone', 'status' => 'contacted', 'priority' => 'high', 'notes' => 'Called about M-Sand pricing. Has an ongoing apartment project. Interested in contract pricing for 6 months. Follow up this week.', 'assigned_to' => 'Varman', 'estimated_value' => 1800000.00, 'project_type' => 'Apartment Building', 'location' => 'Tiruppur', 'tags' => json_encode(['contract', 'apartment', 'm-sand']), 'last_contacted_at' => now()->subDay(), 'created_at' => now()->subDays(3), 'updated_at' => now()->subDay()],
            ['name' => 'Selvan Road Works', 'email' => 'selvan.rw@gmail.com', 'phone' => '+91 77889 00112', 'source' => 'referral', 'status' => 'qualified', 'priority' => 'urgent', 'notes' => 'Referred by Rajesh Kumar. Government road contract. Needs 500 tons of blue metal immediately. Decision maker is Selvan - MD.', 'assigned_to' => 'Varman', 'estimated_value' => 3200000.00, 'project_type' => 'Road Construction', 'location' => 'Madurai', 'tags' => json_encode(['government', 'road', 'urgent', 'blue-metal']), 'last_contacted_at' => now()->subHours(6), 'created_at' => now()->subDays(5), 'updated_at' => now()->subHours(6)],
            ['name' => 'Nila Housing', 'email' => 'info@nilahousing.com', 'phone' => '+91 66778 99001', 'source' => 'website', 'status' => 'proposal', 'priority' => 'high', 'notes' => 'Sent proposal for complete material supply. 120 villa project in Dindigul. Awaiting approval from their purchase head.', 'assigned_to' => 'Varman', 'estimated_value' => 5500000.00, 'project_type' => 'Villa Project', 'location' => 'Dindigul', 'tags' => json_encode(['villa', 'bulk-order', 'complete-supply']), 'last_contacted_at' => now()->subDays(2), 'created_at' => now()->subDays(10), 'updated_at' => now()->subDays(2)],
            ['name' => 'Murugesan & Sons', 'email' => 'murugesan.sons@email.com', 'phone' => '+91 55667 88990', 'source' => 'whatsapp', 'status' => 'contacted', 'priority' => 'medium', 'notes' => 'Small builder, doing individual houses. Needs bricks and cement regularly. WhatsApp inquiry about pricing.', 'assigned_to' => null, 'estimated_value' => 450000.00, 'project_type' => 'Individual House', 'location' => 'Coimbatore', 'tags' => json_encode(['small-builder', 'regular']), 'last_contacted_at' => now()->subDays(4), 'created_at' => now()->subDays(7), 'updated_at' => now()->subDays(4)],
            ['name' => 'VKS Infrastructure', 'email' => 'vks.infra@company.com', 'phone' => '+91 44556 77889', 'source' => 'website', 'status' => 'won', 'priority' => 'high', 'notes' => 'Won the contract! Supplying complete materials for their warehouse project. First delivery scheduled next Monday.', 'assigned_to' => 'Varman', 'estimated_value' => 1200000.00, 'project_type' => 'Industrial Warehouse', 'location' => 'Tirunelveli', 'tags' => json_encode(['won', 'industrial', 'warehouse']), 'last_contacted_at' => now()->subDay(), 'created_at' => now()->subDays(15), 'updated_at' => now()->subDay()],
            ['name' => 'Rajan Associates', 'email' => 'rajan@associates.com', 'phone' => '+91 33445 66778', 'source' => 'phone', 'status' => 'qualified', 'priority' => 'medium', 'notes' => 'School building construction project in Kanyakumari. Requires quality certification for all materials.', 'assigned_to' => null, 'estimated_value' => 900000.00, 'project_type' => 'Commercial Building', 'location' => 'Kanyakumari', 'tags' => json_encode(['school', 'quality-cert', 'commercial']), 'last_contacted_at' => now()->subDays(3), 'created_at' => now()->subDays(8), 'updated_at' => now()->subDays(3)],
            ['name' => 'Pandian Builders', 'email' => 'pandian.build@gmail.com', 'phone' => '+91 22334 55667', 'source' => 'referral', 'status' => 'lost', 'priority' => 'low', 'notes' => 'Lost to competitor. They went with lower pricing from Salem supplier. Keep in touch for future projects.', 'assigned_to' => 'Varman', 'estimated_value' => 600000.00, 'project_type' => 'Residential', 'location' => 'Thoothukudi', 'tags' => json_encode(['lost', 'price-sensitive']), 'last_contacted_at' => now()->subDays(12), 'created_at' => now()->subDays(20), 'updated_at' => now()->subDays(12)],
            ['name' => 'Green Valley Homes', 'email' => 'greenvalley@homes.in', 'phone' => '+91 11223 44556', 'source' => 'social', 'status' => 'new', 'priority' => 'medium', 'notes' => 'Found us on Instagram. Interested in AAC blocks for eco-friendly housing project. First-time buyer.', 'assigned_to' => null, 'estimated_value' => 750000.00, 'project_type' => 'Eco Housing', 'location' => 'Coimbatore', 'tags' => json_encode(['eco-friendly', 'aac', 'new-client']), 'last_contacted_at' => null, 'created_at' => now()->subHours(5), 'updated_at' => now()->subHours(5)],
            ['name' => 'Southern Star Projects', 'email' => 'procurement@southernstar.in', 'phone' => '+91 99112 23344', 'source' => 'website', 'status' => 'proposal', 'priority' => 'urgent', 'notes' => 'Mega township project. 500+ units. They want exclusive supply agreement. Meeting scheduled next week at their office.', 'assigned_to' => 'Varman', 'estimated_value' => 12000000.00, 'project_type' => 'Township', 'location' => 'Madurai', 'tags' => json_encode(['mega-project', 'exclusive', 'township']), 'last_contacted_at' => now()->subDay(), 'created_at' => now()->subDays(6), 'updated_at' => now()->subDay()],
        ];

        DB::table('leads')->insert($leads);
    }

    private function seedVisitorSessions(): void
    {
        if (DB::table('visitor_sessions')->count() > 0) return;

        $cities = [
            ['city' => 'Coimbatore', 'region' => 'Tamil Nadu', 'country' => 'India'],
            ['city' => 'Chennai', 'region' => 'Tamil Nadu', 'country' => 'India'],
            ['city' => 'Madurai', 'region' => 'Tamil Nadu', 'country' => 'India'],
            ['city' => 'Tiruppur', 'region' => 'Tamil Nadu', 'country' => 'India'],
            ['city' => 'Dindigul', 'region' => 'Tamil Nadu', 'country' => 'India'],
            ['city' => 'Tirunelveli', 'region' => 'Tamil Nadu', 'country' => 'India'],
            ['city' => 'Thoothukudi', 'region' => 'Tamil Nadu', 'country' => 'India'],
            ['city' => 'Bangalore', 'region' => 'Karnataka', 'country' => 'India'],
            ['city' => 'Kochi', 'region' => 'Kerala', 'country' => 'India'],
            ['city' => 'Hyderabad', 'region' => 'Telangana', 'country' => 'India'],
            ['city' => 'Mumbai', 'region' => 'Maharashtra', 'country' => 'India'],
            ['city' => null, 'region' => null, 'country' => null],
        ];

        $devices = ['desktop', 'mobile', 'tablet'];
        $deviceWeights = [45, 50, 5]; // mobile-heavy
        $browsers = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Samsung Internet'];
        $browserWeights = [55, 20, 8, 10, 7];
        $oses = ['Android', 'Windows', 'iOS', 'macOS', 'Linux'];
        $referrers = [null, 'https://www.google.com/', 'https://www.google.co.in/', 'https://www.facebook.com/', 'https://www.instagram.com/', null, null, 'https://www.google.com/', null];
        $pages = ['/', '/products', '/about', '/contact', '/quote', '/faq', '/products/m_sand', '/products/blue_metal', '/products/cement'];

        $rows = [];
        for ($i = 0; $i < 85; $i++) {
            $daysAgo = random_int(0, 30);
            $hoursAgo = random_int(0, 23);
            $firstVisit = now()->subDays($daysAgo)->subHours($hoursAgo);
            $duration = random_int(15, 900);
            $lastActivity = $firstVisit->copy()->addSeconds($duration);
            $pageViews = random_int(1, 12);
            $loc = $cities[array_rand($cities)];
            $device = $this->weightedRandom($devices, $deviceWeights);
            $browser = $this->weightedRandom($browsers, $browserWeights);
            $os = match ($device) {
                'mobile' => random_int(0, 1) ? 'Android' : 'iOS',
                'tablet' => random_int(0, 1) ? 'Android' : 'iOS',
                default => $oses[array_rand(array_slice($oses, 1, 3)) + 1],
            };
            $isBot = $i > 78;
            $ip = $isBot
                ? '66.249.' . random_int(64, 95) . '.' . random_int(1, 254)
                : ($i < 40 ? '49.' : '103.') . random_int(1, 254) . '.' . random_int(1, 254) . '.' . random_int(1, 254);

            $rows[] = [
                'session_id' => Str::uuid()->toString(),
                'ip_address' => $ip,
                'country' => $loc['country'],
                'city' => $loc['city'],
                'region' => $loc['region'],
                'user_agent' => $this->fakeUserAgent($device, $browser, $os),
                'device_type' => $device,
                'browser' => $isBot ? 'Googlebot' : $browser,
                'os' => $isBot ? 'Bot' : $os,
                'referrer' => $referrers[array_rand($referrers)],
                'landing_page' => $pages[array_rand($pages)],
                'page_views' => $pageViews,
                'duration_seconds' => $duration,
                'first_visit_at' => $firstVisit,
                'last_activity_at' => $lastActivity,
                'is_bot' => $isBot,
            ];
        }

        DB::table('visitor_sessions')->insert($rows);
    }

    private function seedPageViews(): void
    {
        if (DB::table('page_views')->count() > 0) return;

        $visitors = DB::table('visitor_sessions')->limit(60)->get();
        $paths = [
            ['path' => '/', 'title' => 'Home - Varman Constructions'],
            ['path' => '/products', 'title' => 'Our Products - Building Materials'],
            ['path' => '/products/m_sand', 'title' => 'M-Sand - Manufactured Sand'],
            ['path' => '/products/blue_metal', 'title' => 'Blue Metal / Jalli'],
            ['path' => '/products/cement', 'title' => 'Premium Cement'],
            ['path' => '/products/red_bricks', 'title' => 'Red Bricks'],
            ['path' => '/products/aac_blocks', 'title' => 'AAC Blocks'],
            ['path' => '/contact', 'title' => 'Contact Us'],
            ['path' => '/quote', 'title' => 'Get a Quote'],
            ['path' => '/faq', 'title' => 'Frequently Asked Questions'],
            ['path' => '/about', 'title' => 'About Varman Constructions'],
        ];
        $pathWeights = [30, 20, 10, 8, 8, 5, 4, 5, 5, 3, 2];

        $rows = [];
        foreach ($visitors as $v) {
            $numViews = random_int(1, min($v->page_views, 6));
            for ($j = 0; $j < $numViews; $j++) {
                $idx = $this->weightedRandomIndex($pathWeights);
                $p = $paths[$idx];
                $viewedAt = now()->subDays(random_int(0, 30))->subMinutes(random_int(0, 1440));
                $rows[] = [
                    'visitor_session_id' => $v->id,
                    'path' => $p['path'],
                    'title' => $p['title'],
                    'ip_address' => $v->ip_address,
                    'referrer' => $v->referrer,
                    'time_on_page' => random_int(5, 180),
                    'viewed_at' => $viewedAt,
                ];
            }
        }

        // Insert in chunks
        foreach (array_chunk($rows, 50) as $chunk) {
            DB::table('page_views')->insert($chunk);
        }
    }

    private function seedActivityLogs(): void
    {
        if (DB::table('activity_logs')->count() > 0) return;

        $actions = [
            ['action' => 'login', 'entity_type' => 'auth', 'description' => "Admin 'admin' logged in"],
            ['action' => 'login', 'entity_type' => 'auth', 'description' => "Admin 'admin' logged in"],
            ['action' => 'login', 'entity_type' => 'auth', 'description' => "Admin 'admin' logged in"],
            ['action' => 'update', 'entity_type' => 'product', 'entity_id' => 'm_sand', 'description' => 'Updated product: M-Sand (Manufactured Sand)'],
            ['action' => 'update', 'entity_type' => 'product', 'entity_id' => 'cement', 'description' => 'Updated product: Cement'],
            ['action' => 'create', 'entity_type' => 'faq', 'entity_id' => '1', 'description' => 'Created FAQ: What areas do you deliver to?'],
            ['action' => 'update', 'entity_type' => 'settings', 'description' => 'Updated site settings'],
            ['action' => 'create', 'entity_type' => 'page', 'entity_id' => '1', 'description' => 'Created page: About Us'],
            ['action' => 'create', 'entity_type' => 'page', 'entity_id' => '2', 'description' => 'Created page: Privacy Policy'],
            ['action' => 'update', 'entity_type' => 'page', 'entity_id' => '1', 'description' => 'Updated page: About Us'],
            ['action' => 'create', 'entity_type' => 'lead', 'entity_id' => '1', 'description' => 'Created lead: Arjun Developers Pvt Ltd'],
            ['action' => 'update', 'entity_type' => 'lead', 'entity_id' => '2', 'description' => 'Updated lead: Kumaran Constructions'],
            ['action' => 'update', 'entity_type' => 'lead', 'entity_id' => '3', 'description' => 'Updated lead: Selvan Road Works - status changed to qualified'],
            ['action' => 'view', 'entity_type' => 'contact', 'entity_id' => '4', 'description' => 'Viewed contact: Lakshmi Devi'],
            ['action' => 'update', 'entity_type' => 'quote', 'entity_id' => '5', 'description' => 'Updated quote status to approved: Manoj Kumar'],
            ['action' => 'login', 'entity_type' => 'auth', 'description' => "Admin 'admin' logged in"],
            ['action' => 'update', 'entity_type' => 'product', 'entity_id' => 'blue_metal', 'description' => 'Updated product: Blue Metal (Jalli)'],
            ['action' => 'create', 'entity_type' => 'page', 'entity_id' => '3', 'description' => 'Created page: Terms & Conditions'],
            ['action' => 'update', 'entity_type' => 'lead', 'entity_id' => '6', 'description' => 'Updated lead: VKS Infrastructure - status changed to won'],
            ['action' => 'update', 'entity_type' => 'settings', 'description' => 'Updated site settings - contact information'],
        ];

        $rows = [];
        $ips = ['192.168.1.100', '49.37.128.55', '103.21.58.193'];
        foreach ($actions as $i => $a) {
            $rows[] = [
                'admin_user_id' => 1,
                'action' => $a['action'],
                'entity_type' => $a['entity_type'],
                'entity_id' => $a['entity_id'] ?? null,
                'description' => $a['description'],
                'old_values' => null,
                'new_values' => null,
                'ip_address' => $ips[array_rand($ips)],
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
                'created_at' => now()->subHours($i * 4 + random_int(0, 3)),
            ];
        }

        DB::table('activity_logs')->insert($rows);
    }

    private function seedCmsPages(): void
    {
        if (DB::table('cms_pages')->count() > 0) return;

        $pages = [
            [
                'slug' => 'about',
                'title' => 'About Varman Constructions',
                'content' => '<h2>Our Story</h2><p>Varman Constructions was founded in 2020 with a mission to provide premium quality building materials at competitive prices across Tamil Nadu. Starting from Coimbatore, we have expanded our operations to serve clients across the state.</p><h2>Our Mission</h2><p>To be the most trusted building materials supplier in Tamil Nadu by providing consistent quality, competitive pricing, and exceptional customer service.</p><h2>Why Choose Us</h2><ul><li>200+ projects completed successfully</li><li>Premium quality materials with IS certification</li><li>24-48 hour delivery across Tamil Nadu</li><li>Competitive wholesale pricing</li><li>Expert quality consultation</li></ul>',
                'meta' => json_encode(['title' => 'About Us - Varman Constructions', 'description' => 'Learn about Varman Constructions - Tamil Nadu\'s trusted building materials supplier since 2020']),
                'template' => 'default',
                'status' => 'published',
                'sort_order' => 1,
            ],
            [
                'slug' => 'privacy-policy',
                'title' => 'Privacy Policy',
                'content' => '<h2>Information We Collect</h2><p>We collect information you provide directly to us, such as your name, email address, phone number, and project details when you submit a contact form or request a quote.</p><h2>How We Use Your Information</h2><p>We use the information to respond to your inquiries, provide quotes, process orders, and improve our services.</p><h2>Data Security</h2><p>We implement appropriate security measures to protect your personal information against unauthorized access.</p><h2>Contact Us</h2><p>For privacy-related questions, contact us at info@varmanconstructions.in</p>',
                'meta' => json_encode(['title' => 'Privacy Policy - Varman Constructions', 'description' => 'Privacy policy for Varman Constructions website']),
                'template' => 'default',
                'status' => 'published',
                'sort_order' => 2,
            ],
            [
                'slug' => 'terms-and-conditions',
                'title' => 'Terms & Conditions',
                'content' => '<h2>Order Terms</h2><p>All orders are subject to availability and confirmation of the order price. Prices are subject to change without prior notice.</p><h2>Delivery</h2><p>We aim to deliver within 24-48 hours. Delivery times may vary based on location and order volume. Additional charges may apply for remote areas.</p><h2>Payment Terms</h2><p>Payment is due upon delivery for new customers. Regular customers may avail credit facilities based on transaction history. All payments must be made in Indian Rupees.</p><h2>Quality Guarantee</h2><p>All materials supplied meet IS standards. Quality test reports available on request.</p>',
                'meta' => json_encode(['title' => 'Terms & Conditions - Varman Constructions', 'description' => 'Terms and conditions for ordering building materials from Varman Constructions']),
                'template' => 'default',
                'status' => 'published',
                'sort_order' => 3,
            ],
            [
                'slug' => 'delivery-areas',
                'title' => 'Delivery Areas & Service Zones',
                'content' => '<h2>Primary Service Areas</h2><p>We deliver across Tamil Nadu with special focus on:</p><ul><li><strong>Coimbatore District</strong> - Same day delivery available</li><li><strong>Tiruppur District</strong> - Next day delivery</li><li><strong>Dindigul District</strong> - Next day delivery</li><li><strong>Madurai District</strong> - 24-48 hours</li></ul><h2>Extended Coverage</h2><p>Tirunelveli, Thoothukudi, Kanyakumari, and other districts - delivery within 48 hours. Contact us for specific location availability.</p>',
                'meta' => json_encode(['title' => 'Delivery Areas - Varman Constructions', 'description' => 'Check our delivery areas across Tamil Nadu']),
                'template' => 'default',
                'status' => 'published',
                'sort_order' => 4,
            ],
            [
                'slug' => 'careers',
                'title' => 'Careers at Varman Constructions',
                'content' => '<h2>Join Our Team</h2><p>We are always looking for talented and dedicated individuals to join our growing team. If you are passionate about construction and customer service, we would love to hear from you.</p><h2>Current Openings</h2><p>Please contact us at careers@varmanconstructions.in with your resume and area of interest.</p>',
                'meta' => json_encode(['title' => 'Careers - Varman Constructions', 'description' => 'Career opportunities at Varman Constructions']),
                'template' => 'default',
                'status' => 'draft',
                'sort_order' => 5,
            ],
        ];

        foreach ($pages as $page) {
            DB::table('cms_pages')->insert(array_merge($page, [
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now()->subDays(random_int(1, 15)),
                'updated_at' => now()->subDays(random_int(0, 5)),
            ]));
        }
    }

    private function seedSiteSettings(): void
    {
        if (DB::table('site_settings')->count() > 0) return;

        $settings = [
            ['group' => 'general', 'key' => 'site_name', 'value' => 'Varman Constructions', 'type' => 'text', 'label' => 'Site Name'],
            ['group' => 'general', 'key' => 'site_tagline', 'value' => 'Premium Building Materials Supplier', 'type' => 'text', 'label' => 'Tagline'],
            ['group' => 'general', 'key' => 'site_description', 'value' => 'Tamil Nadu\'s trusted building materials supplier since 2020', 'type' => 'textarea', 'label' => 'Description'],
            ['group' => 'contact', 'key' => 'phone_primary', 'value' => '+91 77084 84811', 'type' => 'text', 'label' => 'Primary Phone'],
            ['group' => 'contact', 'key' => 'phone_secondary', 'value' => '+91 98765 43210', 'type' => 'text', 'label' => 'Secondary Phone'],
            ['group' => 'contact', 'key' => 'email', 'value' => 'info@varmanconstructions.in', 'type' => 'text', 'label' => 'Email'],
            ['group' => 'contact', 'key' => 'whatsapp', 'value' => '+917708484811', 'type' => 'text', 'label' => 'WhatsApp Number'],
            ['group' => 'contact', 'key' => 'address', 'value' => 'Coimbatore, Tamil Nadu, India', 'type' => 'textarea', 'label' => 'Address'],
            ['group' => 'social', 'key' => 'facebook', 'value' => 'https://facebook.com/varmanconstructions', 'type' => 'text', 'label' => 'Facebook URL'],
            ['group' => 'social', 'key' => 'instagram', 'value' => 'https://instagram.com/varmanconstructions', 'type' => 'text', 'label' => 'Instagram URL'],
            ['group' => 'social', 'key' => 'youtube', 'value' => '', 'type' => 'text', 'label' => 'YouTube URL'],
            ['group' => 'seo', 'key' => 'meta_title', 'value' => 'Varman Constructions - #1 Building Materials Supplier in Tamil Nadu', 'type' => 'text', 'label' => 'Meta Title'],
            ['group' => 'seo', 'key' => 'meta_description', 'value' => 'Premium M-Sand, Blue Metal, Cement, Bricks, AAC Blocks. 200+ projects completed. 24-48 hr delivery across Tamil Nadu.', 'type' => 'textarea', 'label' => 'Meta Description'],
            ['group' => 'seo', 'key' => 'google_analytics_id', 'value' => '', 'type' => 'text', 'label' => 'Google Analytics ID'],
            ['group' => 'business', 'key' => 'gst_number', 'value' => '33XXXXX1234X1ZX', 'type' => 'text', 'label' => 'GST Number'],
            ['group' => 'business', 'key' => 'working_hours', 'value' => 'Mon-Sat: 8:00 AM - 7:00 PM', 'type' => 'text', 'label' => 'Working Hours'],
            ['group' => 'business', 'key' => 'delivery_areas', 'value' => 'All districts of Tamil Nadu', 'type' => 'text', 'label' => 'Delivery Coverage'],
        ];

        foreach ($settings as $s) {
            DB::table('site_settings')->insert(array_merge($s, [
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(2),
            ]));
        }
    }

    private function seedComponentContent(): void
    {
        if (DB::table('site_settings')->where('group', 'like', 'component_%')->count() > 0) return;

        $components = [
            'component_header' => [
                'phone_primary' => '+91 77084 84811',
                'phone_secondary' => '+91 99652 37777',
                'whatsapp_number' => '917708484811',
                'whatsapp_message' => 'Hi! I\'m interested in building materials from Varman Constructions. Can you help me?',
                'gstin' => '33BTGPM9877H1Z3',
                'nav_items' => 'Home, Products, About, FAQ, Contact',
            ],
            'component_hero' => [
                'trust_badge' => 'Trusted by 500+ Contractors Since 2020',
                'headline' => 'Premium Building Materials Supplier Across Tamil Nadu',
                'subheadline' => 'M-Sand, Blue Metal, Cement, Bricks & more — delivered within 24-48 hours at wholesale prices',
                'check_1' => 'Quality Certified Materials',
                'check_2' => '24-48 Hour Delivery',
                'check_3' => 'Wholesale Prices',
                'cta_primary' => 'Get Free Quote',
                'cta_secondary' => 'WhatsApp Us',
                'social_proof' => 'Rated 4.9/5 by 200+ customers',
            ],
            'component_services' => [
                'section_badge' => 'Our Products',
                'section_title' => 'Premium Building Materials',
                'section_subtitle' => 'We supply a comprehensive range of high-quality construction materials with competitive pricing and reliable delivery across Tamil Nadu.',
                'cta_text' => 'Need Custom Quantities?',
                'cta_button' => 'Get a Custom Quote',
            ],
            'component_about' => [
                'company_name' => 'VARMAN CONSTRUCTIONS',
                'established_year' => '2020',
                'description_1' => 'We are committed to providing the highest quality building materials at competitive prices. With over 5 years of experience, we\'ve served 200+ projects across Tamil Nadu.',
                'description_2' => 'From M-Sand to AAC Blocks, we offer a comprehensive range of construction materials with reliable 24-48 hour delivery across 3+ states.',
                'stat_projects' => '200+',
                'stat_states' => '3+',
                'stat_years' => '5+',
                'mission' => 'To supply the best construction materials at fair prices with reliable delivery, empowering builders and contractors across Tamil Nadu.',
                'vision' => 'To become the most trusted building materials supplier in South India, known for quality, reliability, and customer satisfaction.',
                'email' => 'info@varmanconstructions.in',
                'phone' => '+91 77084 84811',
            ],
            'component_faq' => [
                'section_badge' => 'FAQ',
                'section_title' => 'Frequently Asked Questions',
                'section_subtitle' => 'Find answers to common questions about our products, delivery, and services.',
            ],
            'component_contact' => [
                'section_badge' => 'Contact Us',
                'section_title' => 'Get In Touch',
                'phone_primary' => '+91 77084 84811',
                'phone_secondary' => '+91 99652 37777',
                'email' => 'info@varmanconstructions.in',
                'whatsapp_number' => '917708484811',
                'working_hours' => 'Mon - Sat: 8:00 AM - 8:00 PM',
                'established_text' => 'Est. 2020 - 5+ Years of Trust',
                'form_success_message' => 'Thank you for contacting us! We\'ll get back to you within 2 hours.',
                'materials_list' => 'M-Sand, P-Sand, Blue Metal 12mm, Blue Metal 20mm, Blue Metal 40mm, Red Bricks, Fly Ash Bricks, Concrete Blocks, AAC Blocks, Cement, Size Stone, Other',
            ],
            'component_seo' => [
                'page_title' => 'VARMAN CONSTRUCTIONS - #1 Building Materials Supplier in Tamil Nadu',
                'meta_description' => 'Premium M-Sand, Blue Metal, Cement, Bricks, AAC Blocks supplier. 200+ projects, 24-48hr delivery across Tamil Nadu. Call +91 77084 84811.',
                'meta_keywords' => 'building materials Tamil Nadu, M-Sand supplier, Blue Metal, cement supplier Coimbatore, construction materials',
                'og_title' => 'VARMAN CONSTRUCTIONS - Premium Building Materials',
                'og_description' => 'Tamil Nadu\'s trusted building materials supplier since 2020. Quality certified materials at wholesale prices.',
                'canonical_url' => 'https://varmanconstructions.in/',
            ],
        ];

        foreach ($components as $group => $fields) {
            foreach ($fields as $key => $value) {
                DB::table('site_settings')->insert([
                    'group' => $group,
                    'key' => $key,
                    'value' => $value,
                    'type' => 'text',
                    'label' => ucfirst(str_replace('_', ' ', $key)),
                    'created_at' => now()->subDays(5),
                    'updated_at' => now()->subDays(1),
                ]);
            }
        }
    }

    private function seedSecurityLogs(): void
    {
        if (DB::table('security_logs')->count() > 0) return;

        $logs = [
            ['type' => 'login_success', 'path' => '/api/admin/login', 'ip' => '49.37.128.55', 'severity' => 'info', 'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/145.0.0.0'],
            ['type' => 'login_success', 'path' => '/api/admin/login', 'ip' => '103.21.58.193', 'severity' => 'info', 'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/145.0.0.0'],
            ['type' => 'login_failed', 'path' => '/api/admin/login', 'ip' => '185.220.101.42', 'severity' => 'warning', 'user_agent' => 'Mozilla/5.0 (compatible; scanner/1.0)'],
            ['type' => 'login_failed', 'path' => '/api/admin/login', 'ip' => '185.220.101.42', 'severity' => 'warning', 'user_agent' => 'Mozilla/5.0 (compatible; scanner/1.0)'],
            ['type' => 'rate_limit', 'path' => '/api/admin/login', 'ip' => '185.220.101.42', 'severity' => 'high', 'user_agent' => 'Mozilla/5.0 (compatible; scanner/1.0)'],
            ['type' => 'suspicious_path', 'path' => '/wp-admin/admin-ajax.php', 'ip' => '45.33.32.156', 'severity' => 'warning', 'user_agent' => 'Mozilla/5.0 (compatible; Nmap Scripting Engine)'],
            ['type' => 'suspicious_path', 'path' => '/phpmyadmin/', 'ip' => '198.51.100.23', 'severity' => 'warning', 'user_agent' => 'python-requests/2.31.0'],
            ['type' => 'suspicious_path', 'path' => '/.env', 'ip' => '203.0.113.45', 'severity' => 'high', 'user_agent' => 'Go-http-client/1.1'],
            ['type' => 'xss_attempt', 'path' => '/api/contact', 'ip' => '198.51.100.78', 'severity' => 'high', 'user_agent' => 'Mozilla/5.0 (X11; Linux x86_64) Firefox/115.0'],
            ['type' => 'sql_injection_attempt', 'path' => '/api/products', 'ip' => '203.0.113.99', 'severity' => 'critical', 'user_agent' => 'sqlmap/1.7.8'],
            ['type' => 'login_success', 'path' => '/api/admin/login', 'ip' => '49.37.128.55', 'severity' => 'info', 'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/145.0.0.0'],
            ['type' => 'suspicious_path', 'path' => '/wp-login.php', 'ip' => '45.33.32.200', 'severity' => 'warning', 'user_agent' => 'Mozilla/5.0 (compatible; bot)'],
            ['type' => 'suspicious_path', 'path' => '/xmlrpc.php', 'ip' => '198.51.100.150', 'severity' => 'warning', 'user_agent' => 'Mozilla/5.0'],
            ['type' => 'bot_detected', 'path' => '/', 'ip' => '66.249.64.78', 'severity' => 'info', 'user_agent' => 'Googlebot/2.1 (+http://www.google.com/bot.html)'],
            ['type' => 'bot_detected', 'path' => '/products', 'ip' => '66.249.64.80', 'severity' => 'info', 'user_agent' => 'Googlebot/2.1 (+http://www.google.com/bot.html)'],
            ['type' => 'login_failed', 'path' => '/api/admin/login', 'ip' => '91.134.203.45', 'severity' => 'warning', 'user_agent' => 'Mozilla/5.0 (compatible; brute-force)'],
            ['type' => 'rate_limit', 'path' => '/api/contact', 'ip' => '185.107.56.89', 'severity' => 'warning', 'user_agent' => 'python-requests/2.28.0'],
            ['type' => 'login_success', 'path' => '/api/admin/login', 'ip' => '49.37.128.55', 'severity' => 'info', 'user_agent' => 'Mozilla/5.0 (Linux; Android 14) Chrome/145.0.0.0 Mobile'],
            ['type' => 'file_upload', 'path' => '/api/admin/upload', 'ip' => '49.37.128.55', 'severity' => 'info', 'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/145.0.0.0'],
            ['type' => 'suspicious_path', 'path' => '/api/../../etc/passwd', 'ip' => '203.0.113.67', 'severity' => 'critical', 'user_agent' => 'curl/7.88.1'],
        ];

        $rows = [];
        foreach ($logs as $i => $log) {
            $rows[] = array_merge($log, [
                'timestamp' => now()->subHours($i * 3 + random_int(0, 2))->toDateTimeString(),
            ]);
        }

        DB::table('security_logs')->insert($rows);
    }

    private function seedAnalytics(): void
    {
        if (DB::table('analytics_views')->count() > 0) return;

        $rows = [];
        for ($i = 0; $i < 30; $i++) {
            $date = now()->subDays($i)->toDateString();
            $rows[] = [
                'date' => $date,
                'views' => random_int(15, 120),
            ];
        }
        DB::table('analytics_views')->insert($rows);

        $clicks = [
            ['element' => 'hero_cta', 'count' => random_int(80, 200)],
            ['element' => 'whatsapp_button', 'count' => random_int(150, 350)],
            ['element' => 'call_button', 'count' => random_int(100, 280)],
            ['element' => 'quote_form_submit', 'count' => random_int(40, 90)],
            ['element' => 'contact_form_submit', 'count' => random_int(50, 110)],
            ['element' => 'product_view_msand', 'count' => random_int(60, 150)],
            ['element' => 'product_view_cement', 'count' => random_int(50, 130)],
            ['element' => 'product_view_bluemetal', 'count' => random_int(45, 120)],
            ['element' => 'footer_phone', 'count' => random_int(30, 80)],
            ['element' => 'social_instagram', 'count' => random_int(10, 40)],
        ];
        DB::table('analytics_clicks')->insert($clicks);
    }

    private function seedNotifications(): void
    {
        if (DB::table('notifications')->count() > 0) return;

        $notifications = [
            ['type' => 'success', 'title' => 'New Contact Form Submission', 'message' => 'Rajesh Kumar submitted a contact form inquiry about M-Sand supply for a residential project.', 'action_url' => '/admin/contacts', 'is_read' => false, 'admin_user_id' => 1, 'created_at' => now()->subHours(2)],
            ['type' => 'success', 'title' => 'New Quote Request', 'message' => 'Arun Prakash requested a quote for M-Sand, Blue Metal, and Cement for an apartment complex project.', 'action_url' => '/admin/quotes', 'is_read' => false, 'admin_user_id' => 1, 'created_at' => now()->subHours(4)],
            ['type' => 'info', 'title' => 'New Lead Created', 'message' => 'A new lead was automatically created from a website inquiry: Arjun Developers Pvt Ltd.', 'action_url' => '/admin/leads', 'is_read' => false, 'admin_user_id' => 1, 'created_at' => now()->subHours(5)],
            ['type' => 'warning', 'title' => 'Security Alert: Failed Login Attempts', 'message' => 'Multiple failed login attempts detected from IP 185.220.101.42. Rate limiting has been applied.', 'action_url' => '/admin/security', 'is_read' => false, 'admin_user_id' => 1, 'created_at' => now()->subHours(8)],
            ['type' => 'info', 'title' => 'Lead Status Updated', 'message' => 'VKS Infrastructure lead status changed to "Won". Estimated value: ₹12,00,000.', 'action_url' => '/admin/leads', 'is_read' => true, 'admin_user_id' => 1, 'created_at' => now()->subDay()],
            ['type' => 'success', 'title' => 'New Contact Submission', 'message' => 'Priya Natarajan from Madurai submitted a contact inquiry about Blue Metal.', 'action_url' => '/admin/contacts', 'is_read' => true, 'admin_user_id' => 1, 'created_at' => now()->subDay()],
            ['type' => 'warning', 'title' => 'Suspicious Activity Detected', 'message' => 'SQL injection attempt blocked from IP 203.0.113.99 targeting /api/products endpoint.', 'action_url' => '/admin/security', 'is_read' => true, 'admin_user_id' => 1, 'created_at' => now()->subDays(2)],
            ['type' => 'info', 'title' => 'Weekly Traffic Summary', 'message' => 'Last week: 342 visitors, 1,245 page views. Top source: Google (58%). Most viewed: Products page.', 'action_url' => '/admin/visitors', 'is_read' => true, 'admin_user_id' => 1, 'created_at' => now()->subDays(3)],
            ['type' => 'success', 'title' => 'Quote Approved', 'message' => 'Quote for Manoj Kumar (₹1,50,000 est.) has been approved and customer notified.', 'action_url' => '/admin/quotes', 'is_read' => true, 'admin_user_id' => 1, 'created_at' => now()->subDays(4)],
            ['type' => 'error', 'title' => 'Path Traversal Attempt Blocked', 'message' => 'Blocked path traversal attempt to /api/../../etc/passwd from IP 203.0.113.67.', 'action_url' => '/admin/security', 'is_read' => true, 'admin_user_id' => 1, 'created_at' => now()->subDays(5)],
        ];

        DB::table('notifications')->insert($notifications);
    }

    // ── Helpers ─────────────────────────────────────────────────

    private function weightedRandom(array $items, array $weights): string
    {
        return $items[$this->weightedRandomIndex($weights)];
    }

    private function weightedRandomIndex(array $weights): int
    {
        $total = array_sum($weights);
        $rand = random_int(1, $total);
        $sum = 0;
        foreach ($weights as $i => $w) {
            $sum += $w;
            if ($rand <= $sum) return $i;
        }
        return 0;
    }

    private function fakeUserAgent(string $device, string $browser, string $os): string
    {
        return match ($device) {
            'mobile' => match ($os) {
                'Android' => "Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) {$browser}/145.0.0.0 Mobile Safari/537.36",
                'iOS' => "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
                default => "Mozilla/5.0 (Linux; Android 14) {$browser}/145.0.0.0 Mobile Safari/537.36",
            },
            'tablet' => "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/604.1",
            default => match ($os) {
                'Windows' => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) {$browser}/145.0.0.0 Safari/537.36",
                'macOS' => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) {$browser}/145.0.0.0 Safari/537.36",
                'Linux' => "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) {$browser}/145.0.0.0 Safari/537.36",
                default => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) {$browser}/145.0.0.0",
            },
        };
    }
}
