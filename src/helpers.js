export const stringToNumber = (currency) => {
  if (typeof currency === "string") {
    const newString = currency.replace("$", "");
    const number = Number(newString);
    return number;
  } else {
    return currency;
  }
};

export const addPoints = (currency) => {
  let points = 0;
  if (currency >= 50 && currency <= 100) {
    currency = currency - 50;
    points = points + currency;
  } else if (currency > 100) {
    currency = currency - 100;
    points = 50;
    currency = currency * 2;
    points = points + currency;
  }
  return points;
};

export const convertToRewards = (monthExp) => {
  const rewardsPoints = monthExp.map((item) => {
    const { rewards } = item;
    for (let property in rewards) {
      rewards[property] = addPoints(parseInt(rewards[property]));
    }
    return item;
  });
  return rewardsPoints;
};
