import { useState, useEffect } from 'react';

function App() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [masterDoctrine, setMasterDoctrine] = useState<string>('');

  // マスター教義一覧
  const masterDoctrines = [
    'D&C8:2-3 聖霊によって、わたしはあなたの思いとあなたの心に告げよう。',
    'D&C49:15-17 結婚は…神によって定められている…。',
    'D&C13:1 アロン神権は「天使の働きの鍵と、悔い改めの福音の鍵と、…バプテスマの鍵を持つ。」',
    'D&C58:42-43 自分の罪を悔い改めた者は赦され〔る〕。',
    'D&C18:10-11 人の価値〔は〕神の目に大いなるものである…。',
    'D&C64:9-11 あなたがたには、すべての人を赦すことが求められる。',
    '復習',
    'D&C18:15-16 もし多くの人をわたしのもとに導くとすればその喜びはいかに大きいことか。',
    'D&C76:22-24 〔イエス・キリスト〕によって…もろもろの世界が現在創造され、また過去に創造された。',
    'D&C19:16-19 わたし〔イエス・キリスト〕は、すべての人に代わってこれらの苦しみを負〔った〕。'
  ];

  // マスター教義を今日の日付に基づいてセット
  const setTodayMasterDoctrine = () => {
    const startDate = new Date(2025, 4, 11); // 2025年5月11日（5月は4）
    const today = new Date();

    const diffMs = today.getTime() - startDate.getTime();

    if (diffMs < 0) {
      setMasterDoctrine(masterDoctrines[0]);
      return;
    }

    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weekNumber = Math.floor(diffMs / msPerWeek);

    const doctrineIndex = weekNumber < masterDoctrines.length
      ? weekNumber
      : masterDoctrines.length - 1;

    setMasterDoctrine(masterDoctrines[doctrineIndex]);
  };

  // セミナリー通知のチェック
  const checkSeminaryTime = () => {
    const now = new Date();
    const day = now.getDay(); // 0:日 1:月 2:火 3:水 4:木 5:金 6:土
    const hour = now.getHours();
    const minute = now.getMinutes();

    // 火水木：19:50〜21:00の間に通知を表示
    if ((day === 2 || day === 3 || day === 4)) {
      if (hour === 19 && minute >= 50) {
        setNotificationMessage('もうすぐセミナリーが始まります。');
        setShowNotification(true);
      } else if (hour >= 20 && hour < 21) {
        setNotificationMessage('セミナリーに参加できます！');
        setShowNotification(true);
      } else {
        setShowNotification(false);
      }
    }
    // 土曜日：0時〜18時の間に通知
    else if (day === 6) {
      if (hour >= 0 && hour < 18) {
        setNotificationMessage('本日のセミナリーは対面です。\n気を付けてきてください。');
        setShowNotification(true);
      } else {
        setShowNotification(false);
      }
    }
    // 他の曜日は通知なし
    else {
      setShowNotification(false);
    }
  };

  // お知らせフォームの state
  const [noticeSender, setNoticeSender] = useState('');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');

  // お知らせ一覧（最初は仮データ）
  const [notices, setNotices] = useState<{ noticeId: string, sender: string, title: string, content: string }[]>([
    { noticeId: '1', sender: '先生A', title: '明日は休みです', content: '明日5月7日の授業は休講です。' },
    { noticeId: '2', sender: '生徒B', title: '早退します', content: '明日3限終了後に早退します。' }
  ]);

  // お知らせフォームの送信処理
  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newNotice = {
      noticeId: Date.now().toString(),
      sender: noticeSender,
      title: noticeTitle,
      content: noticeContent
    };

    // 新しいお知らせを notices に追加（新しいものを上に）
    setNotices([newNotice, ...notices]);

    // 入力欄クリア
    setNoticeSender('');
    setNoticeTitle('');
    setNoticeContent('');

    alert('お知らせを送信しました！');
  };

  useEffect(() => {
    checkSeminaryTime();
    setTodayMasterDoctrine();

    const interval = setInterval(() => {
      checkSeminaryTime();
      setTodayMasterDoctrine();
    }, 60000); // 1分ごと

    return () => clearInterval(interval);
  }, []);

  const zoomUrl = "https://us02web.zoom.us/j/7021898009?pwd=aEROalhrd2p2bEtYYjJWLzFEY0pNZz09";

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>セミナリーアプリ</h1>

      <h2>本日のマスター教義</h2>
      <p style={{ fontSize: '16px', whiteSpace: 'pre-line' }}>{masterDoctrine}</p>

      {showNotification && (
        <div style={{ border: '2px solid blue', padding: '20px', margin: '20px auto', width: '320px' }}>
          <p style={{ fontSize: '18px', whiteSpace: 'pre-line' }}>{notificationMessage}</p>

          {notificationMessage.includes('セミナリー') && (
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
              <button
                style={{ padding: '10px 20px' }}
                onClick={() => window.open(zoomUrl, '_blank')}
              >
                参加する
              </button>
              <button
                style={{ padding: '10px 20px' }}
                onClick={() => setShowNotification(false)}
              >
                参加しない
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- お知らせ投稿フォーム --- */}
      <hr style={{ margin: '40px 0' }} />
      <h2>お知らせ投稿</h2>
      <form onSubmit={handleNoticeSubmit} style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>送信者:</label><br />
          <input
            type="text"
            value={noticeSender}
            onChange={(e) => setNoticeSender(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>タイトル:</label><br />
          <input
            type="text"
            value={noticeTitle}
            onChange={(e) => setNoticeTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>内容:</label><br />
          <textarea
            value={noticeContent}
            onChange={(e) => setNoticeContent(e.target.value)}
            required
            rows={4}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>送信</button>
      </form>

      {/* --- お知らせ一覧 --- */}
      <hr style={{ margin: '40px 0' }} />
      <h2>お知らせ一覧</h2>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
        {notices.map((notice) => (
          <div key={notice.noticeId} style={{ border: '1px solid gray', padding: '10px', marginBottom: '10px' }}>
            <strong>{notice.title}</strong><br />
            <em>投稿者: {notice.sender}</em><br />
            <p>{notice.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
