import { Publisher, Subjects, UserUpdatedEvent } from "@jogging/common";

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
    readonly subject = Subjects.UserUpdated;
}