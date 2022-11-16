import {
    ApolloCache,
    ApolloClient,
    FetchResult,
    InMemoryCache,
    MutationOptions,
    NormalizedCacheObject,
    OperationVariables,
    TypedDocumentNode,
} from "@apollo/client/core";
import {QueryOptions} from "@apollo/client/core/watchQueryOptions";
import {ApolloQueryResult} from "@apollo/client/core/types";

export class Client<T extends Client<any>> {

    protected static envVar: string = "CLIENT_ADDRESS";

    public static create<T>(
        address: string = getAddress(this.envVar),
        cache: ApolloCache<NormalizedCacheObject> = new InMemoryCache(),
    ): T {
        return new this(address, cache) as T;
    }

    readonly address: string;
    readonly #client: ApolloClient<NormalizedCacheObject>;
    readonly #cache: ApolloCache<NormalizedCacheObject>;

    protected constructor(uri: string, cache: ApolloCache<NormalizedCacheObject>) {
        this.address = uri;
        this.#cache = cache;
        this.#client = new ApolloClient<NormalizedCacheObject>({uri, cache});
    }

    protected async query<T = any, TVariables = OperationVariables>(
        query: TypedDocumentNode<T, TVariables>,
        variables: TVariables,
    ): Promise<T> {
        const result = await this.queryRaw({query, variables});
        return result.data;
    }

    protected async queryRaw<T = any, TVariables = OperationVariables>(
        options: QueryOptions<TVariables, T>,
    ): Promise<ApolloQueryResult<T>> {
        return this.#client.query(options);
    }

    protected async mutate<TData = any, TVariables = OperationVariables>(
        mutation: TypedDocumentNode<TData, TVariables>,
        variables: TVariables,
    ): Promise<TData> {
        const result = await this.mutateRaw<TData, TVariables>({mutation, variables});
        return result.data;
    }

    protected async mutateRaw<TData = any, TVariables = OperationVariables>(
        options: MutationOptions<TData, TVariables>,
    ): Promise<FetchResult<TData>> {
        return this.#client.mutate<TData, TVariables>(options);
    }

}

function getAddress(envVar: string): string {
    const address = process.env[envVar];
    if (!address) {
        throw new Error(`${envVar} is not defined`);
    }
    return address;
}