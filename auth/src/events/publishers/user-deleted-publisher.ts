import { Publisher, Subjects, UserDeletedEvent } from "@jogging/common";

export class UserDeletedPublisher extends Publisher<UserDeletedEvent> {
    readonly subject = Subjects.UserDeleted;
}