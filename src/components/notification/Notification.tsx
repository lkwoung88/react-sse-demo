import { useEffect, useState } from 'react';
import '@/assets/css/sytle.css';

function Notification() {
    const [messages, setMessages] = useState([]);

    console.log(messages);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:8080/sse/subscribe');

        eventSource.onopen = () => {
            console.log('SSE connection opened.');
        };

        eventSource.addEventListener("event", async function (event) {
            const res = await event.data;
            console.log('Received message:', res);
            setMessages((prevMessages) => [...prevMessages, res]);
        });

        // eventSource.onmessage = async (event) => {
        //     const res = await event.data;
        //     console.log('Received message:', res);
        //
        //     try {
        //         // 데이터가 JSON 문자열로 오기 때문에 JSON.parse 사용
        //         const data = JSON.parse(res);
        //         setMessages((prevMessages) => [...prevMessages, data]);
        //     } catch (e) {
        //         console.error('Error parsing data:', e);
        //     }
        // };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div className="app">
            <div className="content">
                <header className="app-header">
                    <h1>Real-time Notifications</h1>
                </header>
                <main className="notifications-container">
                    {messages.length === 0 ? (
                        <p className="no-messages">No new notifications</p>
                    ) : (
                        messages.map((msg, index) => (
                            <div className="notification-card" key={index}>
                                <p>{msg}</p>
                            </div>
                        ))
                    )}
                </main>
            </div>
        </div>
    );
}

export default Notification;
