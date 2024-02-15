export default async function importFile(fileName: string): Promise<any> {
  return import(fileName)
}
