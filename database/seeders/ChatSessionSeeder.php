<?php

namespace Database\Seeders;

use App\Enums\ChatSenderType;
use App\Enums\ChatSessionStatus;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * ChatSessionSeeder - Crea sesiones de soporte con conversaciones realistas
 *
 * Genera sesiones de chat con mensajes alternados entre cliente y agente.
 * 70% de sesiones cerradas, 30% activas.
 */
class ChatSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = User::where('role', 'customer')->limit(10)->get();

        if ($customers->isEmpty()) {
            $this->command->warn('⚠️  No hay clientes. Creando 5 clientes de prueba...');
            $customers = User::factory()->count(5)->create(['role' => 'customer']);
        }

        $totalSessions = 0;
        $totalMessages = 0;

        // Cada cliente tiene 1-3 sesiones de soporte
        foreach ($customers as $customer) {
            $sessionsCount = rand(1, 3);

            for ($i = 0; $i < $sessionsCount; $i++) {
                // 70% cerradas, 30% activas
                $isClosed = rand(1, 100) <= 70;

                // Crear sesión
                $session = ChatSession::create([
                    'user_id' => $customer->id,
                    'status' => $isClosed ? ChatSessionStatus::Closed : ChatSessionStatus::Active,
                    'subject' => $this->getRandomSubject(),
                ]);

                // Crear 3-15 mensajes por sesión
                $messagesCount = rand(3, 15);

                for ($j = 0; $j < $messagesCount; $j++) {
                    // Alternar entre cliente y agente (siempre empieza el cliente)
                    $isCustomer = ($j % 2 === 0);

                    ChatMessage::create([
                        'session_id' => $session->id,
                        'sender_type' => $isCustomer ? ChatSenderType::Customer : ChatSenderType::Agent,
                        'message_body' => $this->getRealisticMessage($isCustomer, $j),
                        'is_read' => ! $isCustomer || $isClosed, // Mensajes de agente siempre leídos
                    ]);

                    $totalMessages++;
                }

                $totalSessions++;
            }
        }

        $this->command->info("✅ Sesiones de chat creadas: {$totalSessions} conversaciones con {$totalMessages} mensajes");
        $this->command->info('📊 Distribución: ~70% cerradas, ~30% activas');
    }

    /**
     * Asuntos realistas para sesiones de soporte
     */
    private function getRandomSubject(): string
    {
        $subjects = [
            'Consulta sobre producto',
            'Estado de mi pedido',
            'Problema con el pago',
            'Información de envío',
            'Devolución de producto',
            'Consulta sobre garantía',
            'Personalización de muñeca',
            'Compatibilidad de componentes',
            'Cambio de dirección de envío',
            'Facturación y datos fiscales',
            'Recomendación de producto',
            'Disponibilidad de stock',
        ];

        return $subjects[array_rand($subjects)];
    }

    /**
     * Mensajes realistas para conversaciones
     */
    private function getRealisticMessage(bool $isCustomer, int $messageIndex): string
    {
        if ($isCustomer) {
            // Mensajes de clientes
            $messages = [
                'Hola, tengo una consulta sobre este producto.',
                'Buenos días, quisiera saber el estado de mi pedido.',
                '¿Cuánto tarda el envío a Madrid?',
                'El producto llegó con un defecto.',
                '¿Este producto es compatible con el anterior que compré?',
                'Necesito cambiar la dirección de envío.',
                'Perfecto, muchas gracias por la información.',
                'Entendido, procedo con la compra entonces.',
                '¿Tienen este producto en stock?',
                '¿Puedo personalizar los colores?',
                'Genial, me ha quedado claro. Gracias.',
                'De acuerdo, esperaré la confirmación.',
            ];
        } else {
            // Mensajes de agentes de soporte
            $messages = [
                'Hola, gracias por contactarnos. ¿En qué puedo ayudarte?',
                'Claro, déjame revisar la información de tu pedido.',
                'El envío estándar tarda entre 3-5 días laborables.',
                'Lamento que hayas tenido ese problema. Vamos a solucionarlo.',
                'Sí, ese producto es totalmente compatible.',
                'Por supuesto, ¿cuál sería la nueva dirección?',
                'De nada, para eso estamos. ¿Necesitas algo más?',
                'Perfecto, cualquier duda adicional no dudes en contactarnos.',
                'Sí, tenemos stock disponible. ¿Quieres que te reserve uno?',
                'Sí, puedes personalizar varios aspectos. Te envío las opciones.',
                'Me alegro de haber ayudado. ¡Que tengas buen día!',
                'Te he enviado la confirmación por email.',
            ];
        }

        return $messages[array_rand($messages)];
    }
}
