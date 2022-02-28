import { Listener, Subjects, UserDeletedEvent } from "@jogging/common";
import { queueGroupName } from './queue-group-name';
import { Message } from "node-nats-streaming";
import { User } from "../../models/user.model";

export class UserDeletedListener extends Listener<UserDeletedEvent> {
    readonly subject = Subjects.UserDeleted;
    queueGroupName = queueGroupName;
    async onMessage(data: UserDeletedEvent["data"], msg: Message) {

        const user = await User.findByIdAndDelete(data.id);

        if (!user) {
            throw new Error("User Not Found");
        }

        msg.ack();
    }
}