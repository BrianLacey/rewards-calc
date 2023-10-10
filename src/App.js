import { useState, useEffect, useCallback } from "react";
import { stringToNumber, convertToRewards } from "./helpers";
import { getData } from "./services";

const App = () => {
  const [records, setRecords] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const data = await getData();
      const organizedData = organizeRecords(data);
      setRecords(organizedData);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const organizeRecords = (data) => {
    const organizeRecords = data.reduce((total, current) => {
      const hasName = total.some((item) => item.name === current.name);
      if (hasName) {
        const { name, ...remaining } = current;
        const newTotal = total.map((item) => {
          if (item.name === current.name) {
            const newItem = { ...item, data: item.data.concat([remaining]) };
            return newItem;
          } else {
            return item;
          }
        });
        return newTotal;
      } else {
        const { name, ...remaining } = current;
        total.push({ name, data: [remaining] });
        return total;
      }
    }, []);
    return organizeRecords;
  };

  const monthRewards = () => {
    const mapRewards = records.map((item) => {
      const perMonth = item.data.reduce(
        (rewardObj, current) => {
          const month = current.date.slice(0, 3);
          switch (month) {
            case "Apr":
              rewardObj.rewards.apr = rewardObj.rewards.apr + current.currency;
              break;
            case "May":
              rewardObj.rewards.may = rewardObj.rewards.may + current.currency;
              break;
            case "Jun":
              rewardObj.rewards.jun = rewardObj.rewards.jun + current.currency;
              break;
            default:
              break;
          }
          rewardObj.rewards.total =
            rewardObj.rewards.apr +
            rewardObj.rewards.may +
            rewardObj.rewards.jun;
          rewardObj.rewards.total = rewardObj.rewards.total.toFixed(2);
          return rewardObj;
        },
        {
          rewards: { apr: 0, may: 0, jun: 0, total: 0 },
        }
      );
      return perMonth;
    });
    return mapRewards;
  };

  const calcRewards = () => {
    records.map((item) => {
      item.data.forEach((data, ind, arr) => {
        const numCurrency = stringToNumber(data.currency);
        return (arr[ind] = { ...data, currency: numCurrency });
      });
      return null;
    });
    const hasRewards = monthRewards();
    const rewardsPoints = convertToRewards(hasRewards);
    const appendRewards = records.map((item, ind) => {
      return { ...item, ...rewardsPoints[ind] };
    });
    return appendRewards;
  };

  const renderRewards = () => {
    if (records.length > 0) {
      const withRewards = calcRewards();
      return withRewards.map((item) => {
        const { rewards } = item;
        return (
          <>
            Name: {item.name}
            {item.rewards && (
              <ul>
                <li key={`aprRewards ${item.name}`}>Apr. Rewards: {rewards.apr}</li>
                <li key={`mayRewards ${item.name}`}>May. Rewards: {rewards.may}</li>
                <li key={`junRewards ${item.name}`}>Jun. Rewards: {rewards.jun}</li>
                <li key={`totRewards ${item.name}`}>Total: {rewards.total}</li>
              </ul>
            )}
          </>
        );
      });
    } else {
      return null;
    }
  };

  return <>{renderRewards()}</>;
};

export default App;
