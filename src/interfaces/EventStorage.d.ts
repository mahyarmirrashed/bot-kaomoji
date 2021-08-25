import Runner from './RunnerStorage';

export default interface Event {
  name: string;
  run: Runner;
}
