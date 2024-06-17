import actioncable from "actioncable";
import { useEffect, useState } from "react";

import Card from "./Components/Card";

type card = {
    id: number,
    name: string,
    type: number,
    who: string|null,
    mx: number,
    my: number
}

function App() {

    const consumer = actioncable.createConsumer("ws://localhost:3000/cable");

    const [auth, setAuth] = useState<string>("")
    const [cards, setCards] = useState<card[]>([])
    const [room, setRoom] = useState("general")
    const [namer, setNamer] = useState("")
    const [onTable, setOnTable] = useState<card[]>([])
    const [onRoom, setOnRoom] = useState(false)
    const [username, setUsername] = useState<string>();

    const addOnTable = (card: card) => {
        setOnTable(onTables => [...onTables, card])
    }

    const params = {
        channel: "RoomChannel",
        room: room
    }

    const handlers = {
        connected: () => {
            console.log('connected')
        },
        received: (data: any) => {
            console.log(data)

            if (data[0] == "r" && data[1] == username) {
                return setCards(data[2])
            }

            if (data[0] == "s") {
                addOnTable(data[1])
            }
        },
        disconnected: () => console.log("Desconectado")
    }

    const handleCreateRoomForm = (e: any): void => {
        e.preventDefault();

        fetch("http://localhost:3000/room/create", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name: username,
                qusers: 2
            })
        }).then(r => r.json()).then(f => setRoom(f.id))

        console.log(room)
    }
    
    const handleForm =  (e: any): void => {
        e.preventDefault();

        fetch("http://localhost:3000/room", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                content: e.target.message.value,
                room: room,
                users: 2
            })
        }).then(r => console.log(r))

        e.target.message.value = ""
    } 

    const handleJoinRoom = async (e: any) => {
        e.preventDefault()

        consumer.subscriptions.create(params, handlers)

        setOnRoom(true)

        const reponse = await fetch("http://localhost:3000/room", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                user: username,
                room: room
            })
        })

        const res = await reponse.json();

        console.log(res)

        setCards(res['data'][2])
        setNamer(res['data'][3])
    }

    const handleSendCard = (card: card) => {

        fetch("http://localhost:3000/room/send", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                card: card.id,
                room: room,
                who: username
            })
        })

        setCards(cards.filter(c => c.id !== card.id))
    }   

    return (
        <div>

            <div className="flex flex-wrap gap-5">
                <input className="border-2 border-black" type="text" value={username} onChange={(e: any) => setUsername(e.target.value)} />

                <form onSubmit={handleCreateRoomForm}>
                    <input className="border-2 border-black" type="text" onChange={(e: any) => setNamer(e.target.value)} />

                    <button type="submit"> Crear </button>
                </form>

                <form onSubmit={handleJoinRoom}>
                    <input className="border-2 border-black" type="text" value={room} onChange={(e: any) => setRoom(e.target.value)} />

                    <button type="submit"> Unirme </button>
                </form>
            </div>

            {/* { onRoom && 
                <form onSubmit={handleForm}>
                    <input type="text" name="message" onChange={(e: any) => { setAuth(e.target.value); console.log(auth) }} />
                    <button type="submit"> Enviar </button>
                </form>
            } */}

            <h1> Tus cartas ({namer}) </h1>
            <div className="flex gap-1">
            {
                cards.map(
                    (card, index) => <button key={index} onClick={() => handleSendCard(card)}><Card mx={card.mx} my={card.my} /></button>
                )
            }
            </div>

            <h1 className="my-5"> Cartas en mesa </h1>
            <div className="flex gap-1">
            {
                onTable.map((card, index) => <Card key={index} mx={card.mx} my={card.my} />)
            }
            </div>
        </div> 
    )
}

export default App