import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

export default
class AuthorizedHttpLink extends HttpLink {
    constructor(options: HttpLink.Options) {
        const { headers, ...opts } = options;
        super({
            ...opts,
            fetchOptions: {
                mode: 'cors',
                credentials: 'include',
                ...opts.fetchOptions
            }
        });

        if (headers) {
            return setContext((_: any, { headers: current, ...rest }: any) => ({
                ...rest,
                headers: {
                    ...current,
                    ...headers()
                }
            })).concat(this) as AuthorizedHttpLink;
        }

        return this;
    }
}
