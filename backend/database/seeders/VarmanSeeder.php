<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class VarmanSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedProducts();
        $this->seedFaqs();
        $this->seedSiteSettings();
        $this->seedComponentContent();
    }

    private function seedAdmin(): void
    {
        if (DB::table('admin_users')->count() > 0) {
            return;
        }

        DB::table('admin_users')->insert([
            'username' => (string) config('varman.admin_default_user'),
            'password_hash' => Hash::make((string) config('varman.admin_default_pass')),
            'role' => 'admin',
            'name' => 'Super Admin',
            'email' => (string) config('varman.admin_email'),
            'must_change_password' => true,
        ]);
    }

    private function seedProducts(): void
    {
        $products = [
            [
                'id' => 'm_sand',
                'icon' => 'layers',
                'name' => 'M-Sand (Manufactured Sand)',
                'short_description' => 'High-quality manufactured sand for all construction needs',
                'description' => 'High-quality manufactured sand for all construction needs. Premium manufactured sand produced under controlled conditions for consistent quality and performance.',
                'specifications' => ['Fineness Modulus: 2.6-3.0', 'Silt Content: <3%', 'Water Absorption: <2%', 'Bulk Density: 1.75-1.85 kg/m3'],
                'uses' => ['Concrete mixing', 'Plastering work', 'Block work', 'Foundation construction'],
                'advantages' => ['Consistent quality', 'No impurities', 'Better workability', 'Environmentally friendly'],
                'unit' => 'per Unit',
                'image' => './assets/msand.webp',
                'active' => 1,
            ],
            [
                'id' => 'p_sand',
                'icon' => 'droplets',
                'name' => 'P-Sand (Plastering Sand)',
                'short_description' => 'Fine plastering sand for smooth wall finishes',
                'description' => 'Fine plastering sand for smooth wall finishes. Specially processed plastering sand for achieving smooth and durable wall finishes.',
                'specifications' => ['Fineness Modulus: 1.8-2.2', 'Silt Content: <2%', 'Grain Size: 0.15-2.36mm'],
                'uses' => ['Wall plastering', 'Ceiling work', 'Fine finishing', 'Decorative plastering'],
                'advantages' => ['Ultra-fine texture', 'Smooth finish', 'Better adhesion', 'Reduced cracking'],
                'unit' => 'per Unit',
                'image' => './assets/psand.webp',
                'active' => 1,
            ],
            [
                'id' => 'blue_metal',
                'icon' => 'zap',
                'name' => 'Blue Metal (Jalli)',
                'short_description' => 'Crushed stone aggregate for concrete and road construction',
                'description' => 'Crushed stone aggregate for concrete and road construction. High-quality crushed blue granite stone available in various sizes.',
                'specifications' => ['20mm - Standard concrete', '40mm - Road construction', '12mm - Fine concrete work'],
                'uses' => ['Concrete mixing', 'Road base', 'Drainage systems', 'Foundation work'],
                'advantages' => ['High strength', 'Durable', 'Weather resistant', 'Multiple sizes available'],
                'unit' => 'per ton',
                'image' => './assets/blue metals.webp',
                'active' => 1,
            ],
            [
                'id' => 'red_bricks',
                'icon' => 'home',
                'name' => 'Red Bricks',
                'short_description' => 'Traditional clay bricks for wall construction',
                'description' => 'Traditional clay bricks for wall construction. Traditional kiln-fired clay bricks known for durability and thermal insulation.',
                'specifications' => ['Size: 9x4.5x3 inches', 'Compressive Strength: >3.5 N/mm2', 'Water Absorption: <20%'],
                'uses' => ['Wall construction', 'Boundary walls', 'Pillars', 'Load-bearing structures'],
                'advantages' => ['Good insulation', 'Fire resistant', 'Durable', 'Eco-friendly'],
                'unit' => 'per pieces',
                'image' => './assets/red brick.webp',
                'active' => 1,
            ],
            [
                'id' => 'fly_ash_bricks',
                'icon' => 'leaf',
                'name' => 'Fly Ash Bricks',
                'short_description' => 'Modern eco-friendly bricks made from fly ash, offering better strength.',
                'description' => 'Eco-friendly bricks made from fly ash. Modern eco-friendly bricks offering better strength and uniform size.',
                'specifications' => ['Size: 9x4x3 inches', 'Compressive Strength: >7.5 N/mm2', 'Water Absorption: <12%'],
                'uses' => ['Wall construction', 'High-rise buildings', 'Commercial structures', 'Residential projects'],
                'advantages' => ['Higher strength', 'Uniform size', 'Less mortar required', 'Eco-friendly'],
                'unit' => 'per pieces',
                'image' => './assets/brick.webp',
                'active' => 1,
            ],
            [
                'id' => 'concrete_blocks',
                'icon' => 'square',
                'name' => 'Concrete Blocks',
                'short_description' => 'Solid and hollow concrete blocks for construction',
                'description' => 'Solid and hollow concrete blocks for construction. Machine-made concrete blocks available in solid and hollow variants.',
                'specifications' => ['Solid: 16x8x8 inches', 'Hollow: 16x8x8 inches', 'Compressive Strength: >4 N/mm2'],
                'uses' => ['Wall construction', 'Partition walls', 'Compound walls', 'Industrial buildings'],
                'advantages' => ['Quick construction', 'Cost-effective', 'Low maintenance', 'Sound insulation'],
                'unit' => 'per piece',
                'image' => './assets/concretate.webp',
                'active' => 1,
            ],
            [
                'id' => 'cement',
                'icon' => 'package',
                'name' => 'Cement',
                'short_description' => 'Premium quality cement from top brands UltraTech, ACC, Ramco',
                'description' => 'Premium quality cement from top brands including UltraTech, ACC, Ramco, Dalmia, and Chettinad.',
                'specifications' => ['OPC 53 Grade', 'PPC Grade', 'PSC Grade available'],
                'uses' => ['Concrete mixing', 'Plastering', 'Masonry work', 'Foundation'],
                'advantages' => ['Top brands', 'Fresh stock', 'Bulk discounts', 'Doorstep delivery'],
                'unit' => 'per bag',
                'brands' => ['UltraTech', 'ACC', 'Ramco', 'Dalmia', 'Chettinad'],
                'image' => './assets/cement.webp',
                'active' => 1,
            ],
            [
                'id' => 'aac_blocks',
                'icon' => 'box',
                'name' => 'AAC Blocks',
                'short_description' => 'Lightweight autoclaved aerated concrete blocks',
                'description' => 'Lightweight autoclaved aerated concrete blocks. Modern AAC blocks offering excellent thermal insulation and faster construction.',
                'specifications' => ['Sizes: 600x200x100mm to 600x200x300mm', 'Density: 550-650 kg/m3', 'Compressive Strength: 3-4.5 N/mm2'],
                'uses' => ['High-rise construction', 'Green buildings', 'Commercial complexes', 'Residential projects'],
                'advantages' => ['Lightweight', 'Thermal insulation', 'Fire resistant', 'Earthquake resistant'],
                'unit' => 'per pieces',
                'image' => './assets/acc.webp',
                'active' => 1,
            ],
            [
                'id' => 'size_stone',
                'icon' => 'mountain',
                'name' => 'Size Stone / Rough Stone',
                'short_description' => 'Natural stones for foundation and compound walls',
                'description' => 'Natural stones for foundation and compound walls. Natural rough stones and cut size stones for foundation work.',
                'specifications' => ['Rough Stone: Various sizes', 'Size Stone: 9x6 inches standard'],
                'uses' => ['Foundation work', 'Compound walls', 'Retaining walls', 'Landscaping'],
                'advantages' => ['Natural material', 'High durability', 'Load-bearing capacity', 'Aesthetic appeal'],
                'unit' => 'per pieces',
                'image' => './assets/sizestone.webp',
                'active' => 1,
            ],
        ];

        $rows = [];
        foreach ($products as $product) {
            $rows[] = [
                'id' => $product['id'],
                'icon' => $product['icon'],
                'name' => $product['name'],
                'short_description' => $product['short_description'],
                'description' => $product['description'],
                'specifications' => json_encode($product['specifications'] ?? []),
                'uses' => json_encode($product['uses'] ?? []),
                'advantages' => json_encode($product['advantages'] ?? []),
                'unit' => $product['unit'],
                'image' => $product['image'],
                'brands' => json_encode($product['brands'] ?? []),
                'sizes' => json_encode($product['sizes'] ?? []),
                'types' => json_encode($product['types'] ?? []),
                'grades' => json_encode($product['grades'] ?? []),
                'active' => $product['active'],
            ];
        }

        DB::table('products')->upsert(
            $rows,
            ['id'],
            ['icon', 'name', 'short_description', 'description', 'specifications', 'uses', 'advantages', 'unit', 'image', 'brands', 'sizes', 'types', 'grades', 'active']
        );
    }

    private function seedFaqs(): void
    {
        $faqs = [
            // Delivery
            [
                'question' => 'What areas do you deliver to?',
                'answer' => 'We deliver across Tamil Nadu with a primary focus on Coimbatore, Dindigul, Tiruppur, Madurai, Tirunelveli, Thoothukudi, Kanyakumari, and surrounding districts.',
                'category' => 'delivery',
            ],
            [
                'question' => 'How quickly can you deliver?',
                'answer' => 'Standard delivery within 24-48 hours for orders placed before 2 PM within our primary service area. Express delivery available for urgent requirements. Delivery time may vary for remote locations or bulk orders.',
                'category' => 'delivery',
            ],
            [
                'question' => 'Do you deliver to remote areas?',
                'answer' => 'Yes, we deliver to most parts of Tamil Nadu including remote rural areas. Additional delivery charges may apply for locations beyond our standard service zone. Contact us to confirm availability for your location.',
                'category' => 'delivery',
            ],
            [
                'question' => 'Do you offer same-day delivery?',
                'answer' => 'Same-day delivery is available for select materials and locations for orders placed before 10 AM, subject to stock availability. Please call us at +91 77084 84811 to confirm.',
                'category' => 'delivery',
            ],

            // Orders
            [
                'question' => 'What is the minimum order quantity?',
                'answer' => 'Minimum order varies by product: M-Sand/P-Sand - 1 unit (approximately 1 cubic meter), Blue Metal - 1 ton, Bricks - 1000 pieces, Cement - 10 bags. For smaller quantities, please contact us directly.',
                'category' => 'orders',
            ],
            [
                'question' => 'How do I place an order?',
                'answer' => 'You can place an order by calling us at +91 77084 84811, sending a WhatsApp message, or using the contact form on our website. Our team will confirm availability, pricing, and delivery schedule.',
                'category' => 'orders',
            ],
            [
                'question' => 'Can I get a sample before ordering?',
                'answer' => 'Yes, samples are available for most materials. Please visit our yard or contact us to arrange a sample delivery for bulk orders above a minimum threshold.',
                'category' => 'orders',
            ],

            // Quality
            [
                'question' => 'Do you provide quality certifications?',
                'answer' => 'Yes, all our materials meet IS (Indian Standard) specifications. We provide quality test reports and certifications upon request. Our M-Sand and aggregates are tested regularly for gradation, silt content, and other parameters.',
                'category' => 'quality',
            ],
            [
                'question' => 'What brands of cement do you supply?',
                'answer' => 'We supply leading cement brands including UltraTech, ACC, Ramco, Dalmia, and Chettinad. All brands are supplied directly from authorized distributors ensuring fresh stock.',
                'category' => 'quality',
            ],
            [
                'question' => 'How is M-Sand quality guaranteed?',
                'answer' => 'Our M-Sand is sourced from IS-certified manufacturing units. We verify Fineness Modulus (2.6-3.0), Silt Content (<3%), and Water Absorption (<2%) through regular testing to ensure consistent quality for all projects.',
                'category' => 'quality',
            ],

            // Payment
            [
                'question' => 'What are your payment terms?',
                'answer' => 'We accept cash, bank transfer, UPI, and cheques. For new customers, advance payment is required. Regular customers can avail credit facilities based on their transaction history. GST bills are provided for all orders.',
                'category' => 'payment',
            ],
            [
                'question' => 'Do you provide GST invoices?',
                'answer' => 'Yes, we provide proper GST invoices for all orders. Our GSTIN is 33BTGPM9877H1Z3. This is beneficial for contractors and businesses needing input tax credit.',
                'category' => 'payment',
            ],
            [
                'question' => 'Is online payment accepted?',
                'answer' => 'Yes, we accept all major UPI apps (GPay, PhonePe, Paytm), NEFT/RTGS bank transfers, and account-payee cheques. Payment confirmation is shared immediately via WhatsApp.',
                'category' => 'payment',
            ],

            // Pricing
            [
                'question' => 'Do you offer bulk discounts?',
                'answer' => 'Yes, we offer attractive discounts for bulk orders and regular customers. Volume-based pricing is available for construction projects. Contact us with your requirements for a customized quotation.',
                'category' => 'pricing',
            ],
            [
                'question' => 'How are materials priced?',
                'answer' => 'Prices vary by material type, quantity, delivery location, and current market rates. We offer competitive wholesale pricing. Use our contact form or call us for an instant quote tailored to your project requirements.',
                'category' => 'pricing',
            ],
            [
                'question' => 'Are there any hidden charges?',
                'answer' => 'No hidden charges. Our quotes include material cost, delivery charges, and applicable taxes. Everything is clearly mentioned on the invoice before confirmation.',
                'category' => 'pricing',
            ],
        ];

        $rows = array_map(fn (array $faq) => [
            'question' => $faq['question'],
            'answer' => $faq['answer'],
            'category' => $faq['category'],
            'active' => 1,
        ], $faqs);

        if (DB::table('faqs')->count() === 0) {
            DB::table('faqs')->insert($rows);
        }
    }

    private function seedSiteSettings(): void
    {
        if (DB::table('site_settings')->where('group', 'general')->count() > 0) {
            return;
        }

        $settings = [
            // General
            ['group' => 'general', 'key' => 'site_name',        'value' => 'VARMAN CONSTRUCTIONS',                  'type' => 'text',     'label' => 'Site Name'],
            ['group' => 'general', 'key' => 'site_tagline',     'value' => 'Premium Building Materials Supplier',   'type' => 'text',     'label' => 'Tagline'],
            ['group' => 'general', 'key' => 'site_description', 'value' => "Tamil Nadu's trusted building materials supplier since 2020. Quality M-Sand, Blue Metal, Cement, Bricks, AAC Blocks and more.", 'type' => 'textarea', 'label' => 'Description'],
            ['group' => 'general', 'key' => 'established_year', 'value' => '2020',                                  'type' => 'text',     'label' => 'Established Year'],

            // Contact
            ['group' => 'contact', 'key' => 'phone_primary',   'value' => '+91 77084 84811',               'type' => 'text',     'label' => 'Primary Phone'],
            ['group' => 'contact', 'key' => 'phone_secondary',  'value' => '+91 99652 37777',               'type' => 'text',     'label' => 'Secondary Phone'],
            ['group' => 'contact', 'key' => 'email',            'value' => 'info@varmanconstructions.in',   'type' => 'text',     'label' => 'Email'],
            ['group' => 'contact', 'key' => 'whatsapp',         'value' => '917708484811',                  'type' => 'text',     'label' => 'WhatsApp Number'],
            ['group' => 'contact', 'key' => 'address_line1',    'value' => 'Varman Constructions',          'type' => 'text',     'label' => 'Address Line 1'],
            ['group' => 'contact', 'key' => 'address_line2',    'value' => 'Near HP Petrol Bunk',           'type' => 'text',     'label' => 'Address Landmark'],
            ['group' => 'contact', 'key' => 'address_line3',    'value' => 'Porulur - 624616',              'type' => 'text',     'label' => 'Address City & Pincode'],
            ['group' => 'contact', 'key' => 'working_hours',    'value' => 'Mon - Sat: 8:00 AM - 8:00 PM', 'type' => 'text',     'label' => 'Working Hours'],

            // Business
            ['group' => 'business', 'key' => 'gst_number',       'value' => '33BTGPM9877H1Z3',                                   'type' => 'text', 'label' => 'GST Number'],
            ['group' => 'business', 'key' => 'delivery_areas',   'value' => 'All districts of Tamil Nadu',                       'type' => 'text', 'label' => 'Delivery Coverage'],
            ['group' => 'business', 'key' => 'stat_projects',    'value' => '200+',                                               'type' => 'text', 'label' => 'Projects Completed'],
            ['group' => 'business', 'key' => 'stat_states',      'value' => '3+',                                                 'type' => 'text', 'label' => 'States Covered'],
            ['group' => 'business', 'key' => 'stat_years',       'value' => '5+',                                                 'type' => 'text', 'label' => 'Years Experience'],
            ['group' => 'business', 'key' => 'stat_contractors', 'value' => '500+',                                               'type' => 'text', 'label' => 'Contractors Trusted'],

            // SEO
            ['group' => 'seo', 'key' => 'meta_title',            'value' => 'VARMAN CONSTRUCTIONS - #1 Building Materials Supplier in Tamil Nadu',  'type' => 'text',     'label' => 'Meta Title'],
            ['group' => 'seo', 'key' => 'meta_description',      'value' => 'Premium M-Sand, Blue Metal, Cement, Bricks, AAC Blocks supplier. 200+ projects completed. 24-48 hr delivery across Tamil Nadu. Call +91 77084 84811.', 'type' => 'textarea', 'label' => 'Meta Description'],
            ['group' => 'seo', 'key' => 'meta_keywords',         'value' => 'building materials Tamil Nadu, M-Sand supplier, Blue Metal supplier, cement supplier Coimbatore, construction materials, AAC blocks, bricks supplier', 'type' => 'textarea', 'label' => 'Meta Keywords'],
            ['group' => 'seo', 'key' => 'og_title',              'value' => 'VARMAN CONSTRUCTIONS - Premium Building Materials',  'type' => 'text',     'label' => 'OG Title'],
            ['group' => 'seo', 'key' => 'og_description',        'value' => "Tamil Nadu's trusted building materials supplier since 2020. Quality certified materials at wholesale prices.", 'type' => 'textarea', 'label' => 'OG Description'],
            ['group' => 'seo', 'key' => 'canonical_url',         'value' => 'https://varmanconstructions.in/',                   'type' => 'text',     'label' => 'Canonical URL'],
            ['group' => 'seo', 'key' => 'google_analytics_id',   'value' => '',                                                  'type' => 'text',     'label' => 'Google Analytics ID'],

            // Social
            ['group' => 'social', 'key' => 'facebook_url',   'value' => '', 'type' => 'text', 'label' => 'Facebook URL'],
            ['group' => 'social', 'key' => 'instagram_url',  'value' => '', 'type' => 'text', 'label' => 'Instagram URL'],
            ['group' => 'social', 'key' => 'youtube_url',    'value' => '', 'type' => 'text', 'label' => 'YouTube URL'],
        ];

        foreach ($settings as $s) {
            DB::table('site_settings')->insertOrIgnore(array_merge($s, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    private function seedComponentContent(): void
    {
        if (DB::table('site_settings')->where('group', 'like', 'component_%')->count() > 0) {
            return;
        }

        $components = [
            'component_header' => [
                'phone_primary'     => '+91 77084 84811',
                'phone_secondary'   => '+91 99652 37777',
                'whatsapp_number'   => '917708484811',
                'whatsapp_message'  => "Hi VARMAN CONSTRUCTIONS! I'm interested in building materials. Can you help me?",
                'gstin'             => '33BTGPM9877H1Z3',
                'nav_items'         => 'Home, Products, About, FAQ, Contact',
            ],

            'component_hero' => [
                'trust_badge'    => 'Trusted by 500+ Contractors Since 2020',
                'headline'       => 'Premium Building Materials Supplier Across Tamil Nadu',
                'subheadline'    => 'Your trusted partner since 2020 for high-quality building materials. We supply M-Sand, Blue Metal, Cement, Bricks, and specialized construction supplies across Tamil Nadu with guaranteed quality and timely delivery.',
                'check_1'        => 'Quality Certified',
                'check_2'        => '24-48hr Delivery',
                'check_3'        => 'Best Prices',
                'cta_primary'    => 'Get Free Quote Now',
                'cta_secondary'  => 'WhatsApp Us',
                'social_proof'   => 'Rated 4.9/5 by 200+ customers',
            ],

            'component_services' => [
                'section_badge'    => 'Our Products',
                'section_title'    => 'Our Building Materials Catalog',
                'section_subtitle' => 'Comprehensive range of high-quality building materials with detailed specifications and competitive pricing',
                'cta_text'         => 'Need Custom Quantities?',
                'cta_button'       => 'Get a Custom Quote',
            ],

            'component_about' => [
                'company_name'    => 'VARMAN CONSTRUCTIONS',
                'established_year'=> '2020',
                'description_1'   => 'VARMAN CONSTRUCTIONS, established in 2020, has rapidly grown to become a trusted supplier of premium building materials across Tamil Nadu. Despite being a relatively new player in the market, our commitment to quality and customer satisfaction has helped us serve over 200+ construction projects successfully.',
                'description_2'   => 'We specialize in supplying high-quality construction materials including M-Sand, Blue Metal (Jalli), various types of bricks, cement, AAC blocks, and natural stones. Our extensive network now covers 3+ states with a primary focus on Tamil Nadu markets, ensuring that quality construction materials reach every corner of our service area.',
                'stat_projects'   => '200+',
                'stat_states'     => '3+',
                'stat_years'      => '5+',
                'mission'         => 'To be the most trusted supplier of high-quality building materials across Tamil Nadu, providing exceptional value to our customers through reliable products, competitive pricing, and outstanding service that supports their construction dreams.',
                'vision'          => 'To become the preferred choice for construction materials across Tamil Nadu by consistently delivering superior quality products, innovative solutions, and establishing new benchmarks for customer satisfaction and industry excellence.',
                'email'           => 'info@varmanconstructions.in',
                'phone'           => '+91 77084 84811',
            ],

            'component_faq' => [
                'section_badge'    => 'FAQ',
                'section_title'    => 'Frequently Asked Questions',
                'section_subtitle' => 'Find answers to common questions about our materials, delivery, pricing, and services',
            ],

            'component_contact' => [
                'section_badge'        => 'Contact Us',
                'section_title'        => 'Get In Touch',
                'phone_primary'        => '+91 77084 84811',
                'phone_secondary'      => '+91 99652 37777',
                'email'                => 'info@varmanconstructions.in',
                'whatsapp_number'      => '917708484811',
                'address_line1'        => 'Varman Constructions',
                'address_line2'        => 'Near HP Petrol Bunk',
                'address_line3'        => 'Porulur - 624616',
                'working_hours'        => 'Mon - Sat: 8:00 AM - 8:00 PM',
                'established_text'     => 'Est. 2020 - 5+ Years of Trust',
                'form_success_message' => "Thank you for contacting us! We'll get back to you within 2 hours.",
                'materials_list'       => 'M-Sand, P-Sand, Blue Metal 12mm, Blue Metal 20mm, Blue Metal 40mm, Red Bricks, Fly Ash Bricks, Concrete Blocks, AAC Blocks, Cement, Size Stone, Other',
            ],

            'component_seo' => [
                'page_title'       => 'VARMAN CONSTRUCTIONS - #1 Building Materials Supplier in Tamil Nadu',
                'meta_description' => 'Premium M-Sand, Blue Metal, Cement, Bricks, AAC Blocks supplier. 200+ projects, 24-48hr delivery across Tamil Nadu. Call +91 77084 84811.',
                'meta_keywords'    => 'building materials Tamil Nadu, M-Sand supplier, Blue Metal, cement supplier Coimbatore, construction materials',
                'og_title'         => 'VARMAN CONSTRUCTIONS - Premium Building Materials',
                'og_description'   => "Tamil Nadu's trusted building materials supplier since 2020. Quality certified materials at wholesale prices.",
                'canonical_url'    => 'https://varmanconstructions.in/',
            ],
        ];

        foreach ($components as $group => $fields) {
            foreach ($fields as $key => $value) {
                DB::table('site_settings')->insertOrIgnore([
                    'group'      => $group,
                    'key'        => $key,
                    'value'      => $value,
                    'type'       => 'text',
                    'label'      => ucfirst(str_replace('_', ' ', $key)),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
