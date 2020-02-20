export type Resolver<ARGUMENTS, RETURN_TYPE, PARENT = {}, CONTEX = {}> = (p: PARENT, args: ARGUMENTS, c: CONTEX) => Promise<RETURN_TYPE>
