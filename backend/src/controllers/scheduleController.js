const prisma = require('../config/prisma');

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DEFAULT_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

const initializeSchedule = async () => {
  const count = await prisma.schedule.count();
  if (count > 0) return;

  for (const day of DAYS) {
    await prisma.schedule.create({
      data: {
        id: `sched_${day.slice(0, 3)}`,
        day,
        enabled: day !== 'sunday',
        slots: day === 'sunday' ? [] : [...DEFAULT_SLOTS]
      }
    });
  }
};

const getSchedule = async (req, res) => {
  try {
    await initializeSchedule();

    const schedule = await prisma.schedule.findMany({
      orderBy: { day: 'asc' }
    });

    const scheduleObj = {};
    schedule.forEach(item => {
      scheduleObj[item.day] = {
        enabled: item.enabled,
        slots: item.slots
      };
    });

    res.json({ success: true, data: scheduleObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { day } = req.params;
    const { enabled, slots } = req.body;

    const schedule = await prisma.schedule.upsert({
      where: { day },
      update: { enabled, slots },
      create: {
        id: `sched_${day.slice(0, 3)}`,
        day,
        enabled,
        slots: slots || []
      }
    });

    res.json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSchedule, updateSchedule, initializeSchedule };