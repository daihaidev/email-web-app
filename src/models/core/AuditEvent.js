import { Message } from 'models/core/Message'

export class AuditEvent {
  constructor(data) {
    data.type = Message.TYPES.event

    Object.assign(this, data)

    this.iconMap = {
      ticket_add_label: 'action_label_s',
      ticket_remove_label: 'action_label_s',
      ticket_set_label: 'action_label_s', // can these be action or event icon?
      ticket_update_state: 'state_hold_s',
      ticket_update_group: 'ticket_inboxThin_s', // check if this is okay
      ticket_update_user: '', // need small assign
      ticket_update_customer: 'state_draft_s',
      ticket_update_subject: 'state_draft_s',
      ticket_sent_auto_reply: '',
      ticket_sent_chat_transcript: '',
      ticket_redact_text: '', // need small redact
      ticket_merged_in: '',
      ticket_split_to: '',
      ticket_message_rated: '',
    }
  }
}
