import Handler from './HandlerStorage';

export default interface Event {
  name: string;
  run: Handler;
}
