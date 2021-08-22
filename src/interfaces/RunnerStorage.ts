import Bot from "../client/Client";

export default interface Runner<T = Record<string, never>> {
  (client: Bot, args: T): Promise<void>;
}
