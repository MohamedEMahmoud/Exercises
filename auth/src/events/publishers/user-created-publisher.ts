import { Publisher, Subjects, UserCreatedEvent } from "@jogging/common";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
    readonly subject = Subjects.UserCreated;
}