const tushare = require('tushare');
module.exports = async (req, res) => {
  const token = process.env.TUSHARE_TOKEN || "YOUR_TUSHARE_TOKEN";
  tushare.setToken(token);
  try{
    // 获取最新交易日基础行情、涨跌家数、涨跌停
    // =========这里需要自行补充：P20/P60/P250/MCL/TRIN的计算逻辑========
    const mockResult = {
      "tradeDate":"2026‑11‑13",
      "szIndex":3634.35,
      "changePct":‑0.59,
      "riseCount": 822,
      "fallCount":4700,
      "flatCount": 80,
      "limitUp":12,
      "limitDown":39,
      "trin":0.54,
      "mcl":‑80,
      "p20":27.2,
      "p60":18.4,
      "p250":11.1,
      "riseMoneyRate":23,
      "riseVolRate":14
    }
    // 自动计算衍生指标
    const total = mockResult.riseCount + mockResult.fallCount + mockResult.flatCount;
    const redRate = (mockResult.riseCount / total)*100;
    const riseHomeRate = (mockResult.riseCount/(mockResult.riseCount+mockResult.fallCount))*100;
    const diffMoney = mockResult.riseMoneyRate‑riseHomeRate;
    const diffVol = mockResult.riseVolRate‑riseHomeRate;
    const score = 4.90 + 0.235*mockResult.p20 + 0.465*mockResult.p60 + 0.105*redRate;

    res.status(200).json({
      ...mockResult,
      redRate,
      riseHomeRate,
      diffMoney,
      diffVol,
      score: Math.min(Math.max(score,0),100)
    })
  }catch(e){
    res.status(500).json({error:e.message})
  }
}
