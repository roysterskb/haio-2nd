import { db } from '@/db';
import { settings } from '@/db/schema';

async function main() {
    const currentTimestamp = new Date().toISOString();
    
    const settingsData = [
        {
            mcpUrl: null,
            mcpToken: null,
            mcpConnected: false,
            entities: '[]',
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        }
    ];

    await db.insert(settings).values(settingsData);
    
    console.log('✅ Settings seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});