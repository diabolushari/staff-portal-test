export default function capitalSnakeCase(str: string) {
    return str.toUpperCase().replace(/\s/g, '_');
}
