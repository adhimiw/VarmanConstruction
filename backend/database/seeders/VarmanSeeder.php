<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class VarmanSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedAdmin();
        $this->seedProducts();
        $this->seedFaqs();
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
            [
                'question' => 'What areas do you deliver to?',
                'answer' => 'We deliver across Tamil Nadu with a primary focus on Coimbatore, Dindigul, Tiruppur, Madurai, Tirunelveli, Thoothukudi, Kanyakumari, and surrounding districts.',
                'category' => 'delivery',
            ],
            [
                'question' => 'What is the minimum order quantity?',
                'answer' => 'Minimum order varies by product: M-Sand/P-Sand - 1 unit (approximately 1 cubic meter), Blue Metal - 1 ton, Bricks - 1000 pieces, Cement - 10 bags. For smaller quantities, please contact us directly.',
                'category' => 'orders',
            ],
            [
                'question' => 'Do you provide quality certifications?',
                'answer' => 'Yes, all our materials meet IS (Indian Standard) specifications. We provide quality test reports and certifications upon request. Our M-Sand and aggregates are tested regularly for gradation, silt content, and other parameters.',
                'category' => 'quality',
            ],
            [
                'question' => 'What are your payment terms?',
                'answer' => 'We accept cash, bank transfer, UPI, and cheques. For new customers, advance payment is required. Regular customers can avail credit facilities based on their transaction history. GST bills are provided for all orders.',
                'category' => 'payment',
            ],
            [
                'question' => 'How quickly can you deliver?',
                'answer' => 'Standard delivery within 24-48 hours for orders placed before 2 PM within our primary service area. Express delivery available for urgent requirements. Delivery time may vary for remote locations or bulk orders.',
                'category' => 'delivery',
            ],
            [
                'question' => 'Do you offer bulk discounts?',
                'answer' => 'Yes, we offer attractive discounts for bulk orders and regular customers. Volume-based pricing is available for construction projects. Contact us with your requirements for a customized quotation.',
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
}
