export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body || {};

    const lines = [
      'Новый лид с лендинга',
      '',
      `Опыт в affiliate: ${data.experience || '-'}`,
      `Опыт в crypto: ${data.cryptoExperience || '-'}`,
      `Вертикаль: ${data.vertical || '-'}`,
      `Позиция: ${data.position || '-'}`,
      `Компания: ${data.company || '-'}`,
      `Telegram: ${data.telegram || '-'}`,
      `Дата: ${data.submittedAt || '-'}`
    ];

    const text = lines.join('\n');

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text
        })
      }
    );

    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      return res.status(500).json({
        error: 'Telegram send failed',
        details: telegramData
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      error: 'Server error',
      details: String(error)
    });
  }
}
