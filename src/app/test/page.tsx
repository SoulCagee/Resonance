import { prisma } from '@/lib/db'

import React from 'react'

export default async function TestPage() {

    const voices = await prisma.voice.findMany();


    return (
        <div>
            <h1>Voices - ({voices.length})</h1>
            <ul>
                {
                    voices.map((voice)=>(
                        <li key={voice.id}>
                            {voice.name} - {voice.variant} - {voice.id}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}
