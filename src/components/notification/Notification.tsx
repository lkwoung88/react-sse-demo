import {useEffect, useState} from 'react';
import '@/assets/css/sytle.css';

function Notification() {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:8080/sse/subscribe');

        eventSource.onopen = () => {
            console.log('SSE connection opened.');
        };

        eventSource.addEventListener("event", async function (event) {
            const res = JSON.parse(event.data);
            console.log('Receive Msg =', res);
            setMessages((prevMessages) => [...prevMessages, res.content]);
        });

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
