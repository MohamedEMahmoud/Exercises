import { Listener, Subjects, UserUpdatedEvent } from "@jogging/common";
import { queueGroupName } from './queue-group-name';
import { Message } from "node-nats-streaming";
import { User } from "../../models/user.model";

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
    readonly subject = Subjects.UserUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data: UserUpdatedEvent["data"], msg: Message) {

        const user = await User.findOne({
            id: data.id,
            version: data.version - 1
        });

        if (!user) {
            throw new Error("User Not Found");
        }

        let fields: { [key: string]: any; } = { ...data };

        delete fields["version"];

        user.set({ ...fields });

        await user.save();


        msg.ack();
    }
}