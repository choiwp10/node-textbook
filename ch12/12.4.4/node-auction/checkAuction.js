const { Good, Auction, User, sequelize } = require('./models');
const schedule = require('node-schedule');

module.exports = async () => {
  try {
    const targets = await Good.findAll({
      where: { soldId: null },
    });
    targets.forEach(async (target) => {
      const end = new Date(target.createdAt);
      end.setHours(end.getHours() + target.end);
      if (new Date() > end) { // 낙찰이 되어야 하는데 낙찰이 안 된 것들
        const success = await Auction.find({
          where: { goodId: target.id },
          order: [['bid', 'DESC']],
        });
        if (success) {  // 낙찰자 있음
          await Good.update({ soldId: success.userId }, { where: { id: target.id } });
          await User.update({
            money: sequelize.literal(`money - ${success.bid}`),
          }, {
              where: { id: success.userId },
            });
        } else {  // 낙찰자 없음
          await Good.update({ soldId: target.ownerId }, { where: { id: target.id } });
        }
      } else {  // 경매가 진행중인 것들
        schedule.scheduledJobs(end, async () => {
          const success = await Auction.find({
            where: { goodId: target.id },
            order: [['bid', 'DESC']],
          });
          if (success) {  // 낙찰자 있음
            await Good.update({ soldId: success.userId }, { where: { id: target.id } });
            await User.update({
              money: sequelize.literal(`money - ${success.bid}`),
            }, {
                where: { id: success.userId },
              });
          } else {  // 낙찰자 없음
            await Good.update({ soldId: target.ownerId }, { where: { id: target.id } });
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
};