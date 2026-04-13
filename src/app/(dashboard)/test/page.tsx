import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import Health from "./health";
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary'

const Page = () => {

    prefetch(trpc.health.queryOptions())
   
    return ( 
        <HydrateClient>
            <h1>TRPC Test Page</h1>
            <ErrorBoundary fallback={<div>loading...</div>}>
                <Suspense fallback={<div>loading</div>}>
                    <Health />
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
     );
}
 
export default Page;