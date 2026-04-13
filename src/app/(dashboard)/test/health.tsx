'use client'

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

const Health = () => {

    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.health.queryOptions())

    return ( 
        <div>
            <p>trpc status</p>
            <p>{data.status}</p>
            <p>{data.code}</p>
        </div>
     );
}
 
export default Health;