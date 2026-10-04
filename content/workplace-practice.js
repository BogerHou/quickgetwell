const lessons = [
  {
    id: "client-sick-reply",
    title: "Replying when a client is unwell",
    summary: "Practise a kind reply that keeps promises realistic.",
    scenario: "A client emails that they are unwell and may reply slowly this week. Your usual emails are brief and friendly. They have not requested new dates, and you cannot authorize deadline changes.",
    question: "Which reply is the best fit here?",
    options: [
      {
        text: "I'm really worried about you. Please tell me exactly what happened.",
        explanation: "This invites personal details and expresses strong concern. That might fit a close relationship, but it goes beyond this client's brief notice."
      },
      {
        text: "Thanks for the update, Alex. I'm sorry you're having a difficult week. I hope you can get some rest.",
        explanation: "This matches the friendly exchange, acknowledges the news, and adds a kind wish without requesting details or changing project arrangements."
      },
      {
        text: "Take as long as you need. I've moved all your deadlines.",
        explanation: "This could reassure someone if the changes were agreed. Here, you would be promising an arrangement you cannot authorize."
      }
    ],
    correctIndex: 1,
    principle: "Keep a caring reply separate from an unconfirmed project decision. Check what you can offer before promising changed dates.",
    examples: [
      { label: "Conversational reply", text: "Thanks for telling me, [Name]. I hope the coming days are easier for you." },
      { label: "Slightly more formal", text: "Thank you for keeping me informed, [Name]. Wishing you a restful few days." }
    ],
    related: { href: "/get-well-soon-messages-for-client/", label: "More wording for a client" },
    sources: [
      {
        title: "EnglishLearning: replying to a sick client",
        url: "https://www.reddit.com/r/EnglishLearning/comments/lbr195/what_to_say_to_someone_when_they_say_theyre_sick/",
        note: "A learner's question inspired the situation; the choices and explanations are our practice material."
      }
    ],
    takeaway: "Acknowledge the news, add a kind wish, and promise only what you can arrange."
  },
  {
    id: "boss-sick-notice",
    title: "Replying to your manager's sick-day notice",
    summary: "Practise sounding respectful in a familiar email exchange.",
    scenario: "Your manager emails you directly to say they are taking today off sick. You normally use first names and short replies. No work question needs answering, and you have not arranged cover for their tasks.",
    question: "Which reply best matches this situation?",
    options: [
      {
        text: "Thanks for letting me know, Maya. I hope you get a chance to rest today.",
        explanation: "This keeps your usual tone and acknowledges the message. It does not need a formal title or a promise about the manager's workload."
      },
      {
        text: "Dear Sir or Madam, I acknowledge receipt of your notification.",
        explanation: "This sounds like an administrative form. Formal language can fit some workplaces, but this greeting ignores your established first-name relationship."
      },
      {
        text: "Take as many days as you need. We'll cover everything for you.",
        explanation: "The intention is generous, but you have not arranged that cover. It would fit better after the people involved had agreed to it."
      }
    ],
    correctIndex: 0,
    principle: "Respect can sound ordinary. Match your usual correspondence and keep reassurance within what you know you can do.",
    examples: [
      { label: "In the existing thread", text: "Sorry you're feeling rough, [Name]. I hope today gives you some time to rest." },
      { label: "With your usual greeting", text: "Hi [Name],\n\nThank you for the update. Sending my best wishes for a more comfortable day.\n\nKind regards,\n[Your name]" }
    ],
    related: { href: "/get-well-soon-messages-for-boss/", label: "More wording for a manager" },
    sources: [
      {
        title: "The Workplace: replying to a sick boss",
        url: "https://workplace.stackexchange.com/questions/152034/how-should-i-reply-appropriately-if-my-boss-tells-me-that-they-are-sick-in-an-e",
        note: "A real question about a direct email; workplace customs vary."
      },
      {
        title: "British Council: business email tone",
        url: "https://englishonline.britishcouncil.org/blog/articles/8-common-faux-pas-in-english-business-emails/",
        note: "Background on greetings and familiarity, adapted to the stated scenario."
      }
    ],
    takeaway: "Use the tone you normally share with your manager; extra formality is not always extra care."
  },
  {
    id: "coworker-you-barely-know",
    title: "Writing to a colleague you barely know",
    summary: "Practise warmth that fits a new working relationship.",
    scenario: "A colleague has told the department they are unwell. You have met twice and are adding a short note to their card. You do not share personal jokes, and you know nothing more about their illness.",
    question: "Which note is the best fit here?",
    options: [
      {
        text: "Nice excuse to escape the meetings! Enjoy your break.",
        explanation: "Some close colleagues enjoy this joke. Here, you do not know whether it would land well, and calling illness a break may feel dismissive."
      },
      {
        text: "You mean the world to me. I wish I could be there beside you.",
        explanation: "This could be sincere between close friends. In this scenario, it suggests a personal bond you have not established."
      },
      {
        text: "Sending you warm wishes, Jordan. I hope you have some comfortable days ahead. From [Your name] in Finance.",
        explanation: "This offers care without assuming closeness or knowing the outcome. Your department helps the recipient place your name."
      }
    ],
    correctIndex: 2,
    principle: "A simple wish can carry warmth. Save personal jokes and intimate language for relationships where that tone is already welcome.",
    examples: [
      { label: "Short card note", text: "I wanted to add my good wishes, [Name]. I hope you have the support you need." },
      { label: "If you met at a team lunch", text: "Warm wishes from [Your name] in [Department]. It was nice meeting you at the team lunch, and I'm thinking of you." }
    ],
    related: { href: "/get-well-soon-messages-for-coworker/", label: "More wording for a colleague" },
    sources: [
      {
        title: "Hallmark: writing a get-well card",
        url: "https://ideas.hallmark.com/articles/encouragement-ideas/get-well-wishes/",
        note: "General guidance on matching a message to its recipient; this exercise is our application."
      }
    ],
    takeaway: "Choose a kind tone you can mean, with enough context for them to recognize you."
  },
  {
    id: "signing-a-team-card",
    title: "Adding your own note to a team card",
    summary: "Practise writing as one signer in a shared space.",
    scenario: "An organizer invites everyone to sign a shared get-well card for a colleague. You are adding your own message, not writing the team's main greeting. Other signers can read it, and nobody has agreed to cover extra work.",
    question: "Which personal note best fits this shared card?",
    options: [
      {
        text: "Thinking of you and sending a little encouragement. Warm wishes, [Your name].",
        explanation: "This is a personal contribution that fits the shared card. It does not speak for other signers or ask the recipient to do anything."
      },
      {
        text: "We all promise to handle whatever you need until you're back.",
        explanation: "An agreed team offer could be useful. As one signer, you cannot make this broad commitment for everyone else."
      },
      {
        text: "Call me tonight so I can hear how everything went.",
        explanation: "A call might be welcome if you arranged it privately. Here, it gives the recipient a task and a deadline within a shared message."
      }
    ],
    correctIndex: 0,
    principle: "Write from your own perspective when adding an individual signature. Use a collective voice when you are representing an agreed group message.",
    examples: [
      { label: "Your individual contribution", text: "Just a little note to wish you a peaceful week, [Name]. Take care, [Your name]." },
      { label: "For an organizer writing an agreed greeting", text: "With warm wishes from everyone signing this card. We hope it brings a little encouragement to your day." }
    ],
    related: { href: "/get-well-soon-card-messages/", label: "More wording for cards" },
    sources: [
      {
        title: "GroupGreeting: shared card FAQ",
        url: "https://www.groupgreeting.com/faq",
        note: "Explains that signers' messages are visible to others; the voice distinction is our teaching choice."
      }
    ],
    takeaway: "Your signature can be personal even when the card comes from a group."
  },
  {
    id: "thanking-work-well-wishers",
    title: "Thanking colleagues while you are still unwell",
    summary: "Practise gratitude without giving an unwanted health update.",
    scenario: "Your team has sent you a card. You are still unwell and do not know when you will return. You want to thank everyone in one short message, without discussing symptoms or making plans.",
    question: "Which reply best matches what you want to say?",
    options: [
      {
        text: "Thanks, everyone. I'm much better now and should be back on Monday.",
        explanation: "This would fit if both statements were true. Here, it reports improvement you have not experienced and suggests a return date you do not know."
      },
      {
        text: "Thanks for the card. I should explain all my symptoms so you understand my absence.",
        explanation: "You can share details when you want to. This adds an explanation you did not want to give; gratitude alone can meet your stated purpose."
      },
      {
        text: "Thank you all for the card. Reading your messages was a lovely part of my day.",
        explanation: "This names the kindness you received and says what it meant. It leaves your health and return-to-work plans out of the thank-you."
      }
    ],
    correctIndex: 2,
    principle: "Thank people for what they sent or did. Add a health update only if it is true and you want to include it.",
    examples: [
      { label: "Thanking the group", text: "The card arrived today. It was lovely to see all your names and messages. Thank you, everyone." },
      { label: "If you have little energy", text: "A quick thank-you for the card. I'm keeping messages short at the moment, but I appreciated every note." }
    ],
    related: { href: "/how-to-respond-to-get-well-soon/", label: "More ways to reply to well wishes" },
    sources: [
      {
        title: "Hallmark: writing a thank-you card",
        url: "https://ideas.hallmark.com/articles/thank-you-ideas/thank-you-messages-what-to-write-in-a-thank-you-card/",
        note: "Supports naming a specific kindness; the health-update distinction is our application."
      }
    ],
    takeaway: "A thank-you can acknowledge care without announcing that you are better."
  }
];

module.exports = { lessons };
