import cron from 'node-cron';
import BackgroundTasks from './utils/backgroundTasks.utils';

const { expiredTokenCleanUp } = BackgroundTasks;

const scheduler = cron.schedule('* 59 23 * * *', expiredTokenCleanUp);

export default scheduler;
