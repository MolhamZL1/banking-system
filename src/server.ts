import app from './app';
import { startScheduledRunner } from './infrastructure/scheduler/scheduled-runner';

const PORT = process.env.PORT || 3000;

startScheduledRunner();

const server = app.listen(Number(PORT), "0.0.0.0",() => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
  console.log('🔻 Shutting down...');
  server.close(() => process.exit(0));
});
