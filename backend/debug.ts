import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const readings = await p.sensorReading.findMany({where:{sensor_id:'TEMP_001'},orderBy:{timestamp:'desc'},take:5});
  console.log('READINGS:', JSON.stringify(readings, null, 2));
  const alerts = await p.alert.findMany({orderBy:{createdAt:'desc'},take:5});
  console.log('ALERTS:', JSON.stringify(alerts, null, 2));
  await p.();
}
main();
