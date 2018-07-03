import { getSchedules } from './util';
import { setCrons } from './setCrons';

(async () => {
  const schedules = await getSchedules();
  await setCrons(schedules);
})();
