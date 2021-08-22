import Runner from './RunnerStorage';

export default interface Command {
  name: string;
  run: Runner;
}
