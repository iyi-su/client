import {
    ApolloCache,
    ApolloClient,
    gql,
    InMemoryCache,
    NormalizedCacheObject,
    OperationVariables,
    TypedDocumentNode,
} from "@apollo/client/core";
import {QueryOptions} from "@apollo/client/core/watchQueryOptions";
import {ApolloQueryResult} from "@apollo/client/core/types";

export class Client<T extends Client<any>> {

    public static create<T>(address: string, cache: ApolloCache<NormalizedCacheObject> = new InMemoryCache()): T {
        return new this(address, cache) as T;
    }

    readonly address: string;
    readonly client: ApolloClient<NormalizedCacheObject>;
    readonly cache: ApolloCache<NormalizedCacheObject>;

    protected constructor(uri: string, cache: ApolloCache<NormalizedCacheObject>) {
        this.address = uri;
        this.cache = cache;
        this.client = new ApolloClient<NormalizedCacheObject>({uri, cache});
    }

    protected async request<T = any, TVariables = OperationVariables>(
        query: TypedDocumentNode<T, TVariables>,
        variables: TVariables,
    ): Promise<T> {
        const result = await this.query({query, variables});
        return result.data;
    }

    protected async requestString<T = any, TVariables = OperationVariables>(
        query: string,
        variables: TVariables,
    ): Promise<T> {
        return this.request(gql(query), variables);
    }

    protected async query<T = any, TVariables = OperationVariables>(
        options: QueryOptions<TVariables, T>,
    ): Promise<ApolloQueryResult<T>> {
        return this.client.query(options);
    }

}