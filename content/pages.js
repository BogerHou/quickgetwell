const pages = [
  {
    slug: "get-well-soon-messages",
    dateModified: "2026-09-22",
    title: "Get Well Soon Messages",
    eyebrow: "Main collection",
    description: "Find thoughtful get well soon messages for texts, cards, work notes, family support, surgery recovery, and sensitive situations.",
    summary: "The main collection of thoughtful messages by tone and situation.",
    intro: "Choose a get well soon message or wish for a text, card, or work note. Start with a short example, then use the relationship and situation guides for more specific wording. If someone has wished you well, use the reply guide below to write a thank-you.",
    nav: "All messages",
    sections: [
      {
        id: "quick",
        title: "Quick get well soon messages",
        messages: [
          "Thinking of you and hoping today feels a little easier.",
          "Wishing you comfort, rest, and steady healing.",
          "Feel better soon. I am sending warm thoughts your way.",
          "No need to reply. I just wanted you to know you are on my mind.",
          "Take all the time you need to rest and recover."
        ],
        links: [
          { slug: "get-well-soon-text-messages", label: "They just told you they are ill? Find a short text response." },
          { slug: "get-well-soon-card-messages", label: "Writing inside a card? See complete notes and closings." },
          { slug: "how-to-respond-to-get-well-soon", label: "Someone wished you well? Find a reply to thank them." }
        ]
      },
      {
        id: "heartfelt",
        title: "Heartfelt get well soon messages",
        messages: [
          "I am so sorry you are going through this. I hope you feel surrounded by care, patience, and love as you heal.",
          "You do not have to rush back to normal. Rest, take things slowly, and let people care for you.",
          "I wish I could make this easier. Until then, I am here for whatever support looks like today."
        ]
      },
      {
        id: "work",
        title: "Professional get well soon messages",
        messages: [
          "Wishing you rest, comfort, and a calm time away. Please take the time you need to feel better.",
          "The team is thinking of you and wishing you comfort, rest, and steady progress.",
          "We miss having you around, but your health comes first. Looking forward to seeing you when you are ready."
        ]
      },
      {
        id: "serious",
        title: "Safer messages for serious illness",
        messages: [
          "I am thinking of you today. No need to reply, I just wanted you to feel supported.",
          "I am so sorry you are going through this. I am here to listen, help, or simply sit with you in it.",
          "Sending comfort, strength, and quiet support through this difficult time."
        ]
      },
      {
        id: "funny",
        title: "Funny get well soon messages",
        intro: "Choose humor they would enjoy in your usual conversations. A serious illness does not tell you whether someone wants a joke; if you are unsure, choose a warm note and let them set the tone.",
        messages: [
          "Get well soon. Your germs have made their point.",
          "Please feel better soon. I am being forced to make my own decisions and it is not going well.",
          "Feel better soon. The world needs your nonsense back in circulation."
        ]
      }
    ],
    decisionGuide: {
      title: "Get well soon, feel better, or thinking of you?",
      intro: "These expressions overlap. Choose wording that fits what the person has told you and how you normally speak to each other; none of them needs to promise a recovery date.",
      items: [
        {
          label: "Get well soon",
          useWhen: "You want a familiar recovery wish for a card or message, and the person is comfortable with that wording.",
          try: "Get well soon. Thinking of you and sending warm wishes."
        },
        {
          label: "Feel better soon",
          useWhen: "You want a conversational reply when someone says they are feeling unwell. It can refer to feeling more comfortable, without claiming that an ongoing condition will disappear.",
          try: "I'm sorry you're feeling unwell. Hope you feel better soon."
        },
        {
          label: "Thinking of you",
          useWhen: "You do not know the outlook, or the person has said recovery wishes do not fit their experience.",
          try: "Thinking of you today. I'm here if you'd like some company."
        }
      ]
    },
    faqs: [
      {
        question: "What is a simple get well soon message?",
        answer: "Try: Thinking of you and hoping today feels a little easier. It is short, kind, and does not pressure the person to reply."
      },
      {
        question: "How do I choose the right get well message?",
        answer: "Match the message to the relationship and seriousness of the illness. Use short and warm for casual notes, practical support for close relationships, and careful wording for serious illness."
      },
      {
        question: "What should I avoid in a get well soon message?",
        answer: "Avoid forced positivity, medical predictions, pressure around timelines, and jokes unless you know the person will welcome humor."
      }
    ],
    dos: ["Match the message to the situation.", "Add one personal detail or offer of help.", "Use no need to reply when the person may be tired."],
    donts: ["Do not force positivity.", "Do not rush recovery.", "Do not assume a joke will be welcome; follow the person's preferences."],
    related: ["get-well-soon-messages-after-surgery", "get-well-soon-messages-for-friend", "what-to-say-instead-of-get-well-soon"]
  },
  {
    slug: "get-well-soon-messages-after-surgery",
    title: "Get Well Soon Messages After Surgery",
    eyebrow: "After surgery",
    dateModified: "2026-09-22",
    description: "Thoughtful get well soon messages after surgery that offer calm support without rushing recovery.",
    summary: "Careful recovery wording that does not rush healing.",
    intro: "Choose a message for the stage they have actually reached: just after surgery, later in recovery, or still waiting for the procedure. Keep the tone familiar, leave out recovery deadlines, and offer help you can follow through on.",
    nav: "After surgery",
    sections: [
      {
        id: "quick",
        title: "Quick copy messages",
        intro: "Use these when you know the procedure has taken place. You do not need to describe the result or ask for medical details.",
        messages: [
          "I am glad the surgery is behind you. Wishing you quiet rest, good care, and no pressure to answer.",
          "I hope today feels a little more comfortable and supported.",
          "Rest as much as you can. No need to reply, I just wanted you to know I am thinking of you.",
          "Sending comfort, patience, and steady support while you recover.",
          "I hope the recovery days feel less lonely and as gentle as possible."
        ]
      },
      {
        id: "before-surgery",
        title: "If surgery is still ahead",
        intro: "A card sent before surgery should look ahead without assuming how the procedure will go. Replace the details below with something true to your relationship.",
        messages: [
          "I will be thinking of you on [day]. No need to send updates; I just wanted to send my love.",
          "Dear [Name], I wanted you to have a note from me before your surgery. I saw [something connected to a shared interest] and thought of you. If you would like some company or a distraction this week, I would love to chat. With love, [Your name]"
        ]
      },
      {
        id: "friend",
        title: "For a friend",
        intro: "Use the way you normally talk together. A familiar joke can fit if your friend welcomes humor, but a serious procedure alone does not tell you what tone they prefer. Leave jokes about their pain or appearance out.",
        messages: [
          "I am so proud of how you are handling this. Let your body take its time. I am here for errands, distractions, or quiet company.",
          "Recovery days can be boring and hard. I can drop off food, send bad jokes, or simply leave you alone in peace. Your call.",
          "You do not have to be doing well on anyone else's timeline. Rest, heal, and let people care for you."
        ]
      },
      {
        id: "work",
        title: "Professional surgery recovery messages",
        messages: [
          "Thinking of you after surgery. Please take the time you need, and know the team is wishing you well.",
          "We hope your recovery time is restful and supported. Your health comes first, and we look forward to seeing you when you are ready.",
          "Sending best wishes for comfort after your procedure. Please focus on rest and care."
        ]
      },
      {
        id: "help",
        title: "Messages with practical help",
        messages: [
          "I can bring dinner, pick up groceries, or handle a small errand this week. No pressure to answer right away.",
          "If rides, meals, or household things would help while you recover, I am available and happy to do something specific.",
          "I do not want to add another task, so I will check in later this week. You never need to reply quickly."
        ]
      },
      {
        id: "longer",
        title: "For a longer recovery",
        messages: [
          "Recovery can take more patience than anyone wants. I am here for the slow days too.",
          "You do not have to measure progress for anyone. I hope today brings a little more comfort and support.",
          "If this takes time, I will keep showing up. You are not expected to rush back for anyone."
        ]
      }
    ],
    decisionGuide: {
      title: "Choose the right surgery message",
      intro: "Start with the timing, then your relationship. If you do not know whether surgery has happened yet, a simple thinking-of-you note avoids guessing.",
      items: [
        {
          label: "Before surgery",
          useWhen: "The procedure is still ahead, even if you have already bought a get well card.",
          try: "I will be thinking of you on [day]. No need to send updates; I just wanted to send my love."
        },
        {
          label: "Right after surgery",
          useWhen: "You know the procedure has happened, but they may not be ready to update people.",
          try: "I am glad the surgery is behind you. No need to reply. I am thinking of you and wishing you quiet rest."
        },
        {
          label: "A few days later",
          useWhen: "You want to check in without asking for a recovery report.",
          try: "Just checking in gently. I hope today feels a little more comfortable and supported."
        },
        {
          label: "Close friend or family",
          useWhen: "You can offer real help, not just a general wish.",
          try: "I can bring food, run errands, or sit with you quietly this week. Tell me what would actually help."
        },
        {
          label: "Work message",
          useWhen: "The relationship is professional and you should remove work pressure.",
          try: "Thinking of you after surgery. Please take the time you need, and know the team is wishing you well."
        }
      ]
    },
    faqs: [
      {
        question: "What can I write in a card before surgery?",
        answer: "Say you are thinking of them ahead of the procedure, then add a familiar detail or a specific offer of company. Avoid saying the surgery is behind them or promising it will go well. If they welcome humor, a joke about a shared interest can sound more like you than a formal wish."
      },
      {
        question: "What should I say after surgery without rushing recovery?",
        answer: "Try: \"I am glad the surgery is behind you. Wishing you quiet rest, good care, and no pressure to answer.\" It acknowledges the procedure without setting a timeline."
      },
      {
        question: "Is it okay to mention the surgery?",
        answer: "Yes, if they have already shared it with you. Keep it simple: say you are thinking of them after the procedure, then focus on comfort, rest, and practical support."
      },
      {
        question: "What practical help can I offer after surgery?",
        answer: "Offer something specific, such as a meal drop-off, a ride, help with groceries, childcare, or handling a small errand. Specific offers are easier to accept than \"let me know.\""
      },
      {
        question: "What should I avoid saying after surgery?",
        answer: "Avoid asking for medical details, promising a timeline, or telling them they should be back to normal on your schedule. Let them recover without performing optimism for you."
      }
    ],
    dos: ["Use calm recovery language, such as take the time you need.", "Offer specific help, like meals or rides.", "Add no need to reply if they may be tired."],
    donts: ["Do not pressure them around recovery timing.", "Do not ask for medical details in a card.", "Do not joke unless you know they want humor."],
    related: ["short-get-well-soon-messages", "get-well-soon-messages-for-coworker", "get-well-soon-messages-for-serious-illness"]
  },
  {
    slug: "get-well-soon-messages-for-coworker",
    title: "Get Well Soon Messages for a Coworker",
    dateModified: "2026-09-22",
    eyebrow: "Workplace wording",
    description: "Short get well soon messages for coworkers and colleagues, including sick-day replies, team cards, and support during a longer recovery.",
    summary: "Warm, professional notes for work cards and Slack.",
    intro: "Choose a brief reply to a sick-day message, a note for a colleague you do not know well, or a card from the team. Match your usual tone and leave work requests for a separate conversation.",
    nav: "For a coworker",
    sections: [
      {
        id: "quick",
        title: "Quick professional messages",
        messages: [
          "Wishing you a restful recovery and time away without pressure. Please take the time you need.",
          "We miss having you around, but your health comes first. Wishing you rest and steady progress.",
          "Sending warm thoughts your way. I hope you feel supported and have space to rest without pressure.",
          "Hope you are able to rest and recover comfortably. Looking forward to seeing you when you are ready."
        ],
        links: [
          { slug: "get-well-soon-messages-for-client", label: "Writing to a client? Find short replies and optional email examples." }
        ]
      },
      {
        id: "sick-day-reply",
        title: "When a coworker tells you they are sick",
        nav: "Reply to sick-day news",
        intro: "If a colleague messages you about feeling unwell today, acknowledge the news and add a kind wish. Keep the tone as conversational as your usual messages.",
        messages: [
          "Thanks for letting me know. I am sorry you are feeling unwell. Hope you feel better soon.",
          "Sorry you are having such a rough day. I hope you can get some rest."
        ],
        links: [
          { slug: "how-to-respond-to-get-well-soon", label: "Are you the one who is unwell? Find replies to a coworker's get well wishes." }
        ]
      },
      {
        id: "not-close",
        title: "For a colleague you do not know well",
        nav: "A less familiar colleague",
        intro: "Keep the note in your own voice and use a channel you already use together when possible. If they may not recognize your name, add the team or department where you met. You do not need to ask what happened.",
        messages: [
          "I was sorry to hear you have been unwell. Sending my best wishes.",
          "Just a short note to wish you well. I hope you have some restful days ahead.",
          "Best wishes from [Your name] in [Department]. I hope you are able to rest comfortably."
        ]
      },
      {
        id: "team",
        title: "Messages from the team",
        intro: "Use a shared voice when you are signing on behalf of the people sending the card. Otherwise, change we to I.",
        messages: [
          "The whole team is thinking of you and wishing you a steady recovery. We hope you feel supported and cared for.",
          "Work is not the same without you, but we hope you are getting the rest you need. Wishing you comfort and healing.",
          "We are all rooting for you and sending good thoughts. Please focus on recovery and know you are missed."
        ]
      },
      {
        id: "funny",
        title: "Light humor for close coworkers",
        intro: "Use humor only if you know the coworker would welcome it. Keep jokes away from their pain, diagnosis, or pressure to return.",
        messages: [
          "Get well soon. The office tried replacing your jokes and the results were deeply concerning.",
          "Your coffee mug is starting to look abandoned. Hope you get the rest you need.",
          "Someone said 'circle back' today and I could practically see your eye-roll. Hope you feel better soon."
        ]
      },
      {
        id: "slack",
        title: "Slack or Teams messages",
        messages: [
          "No need to reply. Just wanted to say the team is thinking of you and hoping you get real rest.",
          "Thinking of you today and hoping you have some time to rest. No need to reply to this note.",
          "Sending warm thoughts from the team. Please do not worry about responding while you recover."
        ]
      },
      {
        id: "longer-recovery",
        title: "During a longer or uncertain recovery",
        nav: "Longer recovery",
        intro: "When you do not know what recovery will look like, you can show care without setting a return date or asking for an update. A former coworker can briefly acknowledge the time since you last spoke.",
        messages: [
          "Thinking of you today and sending warm wishes. There is no need to reply; I just wanted to say hello.",
          "It has been a while since we worked together, but I wanted to let you know you are in my thoughts.",
          "Just sending a little support your way. I hope today brings you some comfort."
        ],
        links: [
          { slug: "get-well-soon-messages-for-serious-illness", label: "Find more wording for serious or uncertain illness." },
          { slug: "get-well-soon-messages-for-cancer", label: "If they have shared a cancer diagnosis, find messages for that situation." }
        ]
      },
      {
        id: "surgery",
        title: "After surgery at work",
        messages: [
          "Thinking of you after surgery. Please focus on rest and recovery, and know the team is wishing you well.",
          "We hope you have a calm, supported recovery after your procedure. Take the time you need.",
          "Sending best wishes from all of us. Your health comes first, and there is no pressure to respond."
        ]
      }
    ],
    decisionGuide: {
      title: "Choose the right coworker message",
      intro: "Start with the conversation you are actually having: responding to news, checking in, or signing a group card. Use I for a personal message and we only when you speak for the group.",
      items: [
        {
          label: "Reply to sick-day news",
          useWhen: "A colleague has just told you they feel unwell.",
          try: "Thanks for letting me know. I am sorry you are feeling unwell. Hope you feel better soon."
        },
        {
          label: "Team card",
          useWhen: "Several people are signing and the tone should include everyone.",
          try: "The whole team is thinking of you. Please take the time you need and know you are missed."
        },
        {
          label: "After surgery",
          useWhen: "They shared that they had a procedure, but you should not ask for details.",
          try: "Thinking of you after surgery. Please focus on rest and care. We are all wishing you well."
        },
        {
          label: "Close coworker",
          useWhen: "You know them well enough for light warmth or humor.",
          try: "Work is quieter without you. Rest up, ignore the inbox, and let us know only if you want company."
        }
      ]
    },
    faqs: [
      {
        question: "How do I write a get well message for a coworker without adding work pressure?",
        answer: "Keep it short, warm, and separate from deadlines. Say the team is thinking of them, and avoid anything that sounds like you need them back soon."
      },
      {
        question: "Can I send a get well message in Slack or Teams?",
        answer: "Yes. Use one or two sentences, avoid private medical questions, and add no need to reply if they may be tired."
      },
      {
        question: "Should I say get well soon or feel better to a sick coworker?",
        answer: "Both can fit a brief reply when a colleague says they are unwell. Hope you feel better soon sounds conversational; wishing you a good recovery may suit a card after surgery. You do not need to know how many days they will be off. For an ongoing or uncertain condition, you can simply say I am thinking of you."
      },
      {
        question: "What if I have not spoken to a former coworker for a long time?",
        answer: "Briefly acknowledge the gap and send a kind note without asking for medical details: It has been a while since we worked together, but I wanted to let you know you are in my thoughts. If you are unsure whether a private channel would be welcome, consider a shared card or a channel you have used together before."
      },
      {
        question: "What should a team card say?",
        answer: "Use shared support rather than workplace urgency: The team is thinking of you, please take the time you need, and we hope you feel cared for."
      }
    ],
    dos: ["Keep the note short and kind.", "Use I for your own note and we for a shared message.", "Respect privacy around the diagnosis."],
    donts: ["Do not mention deadlines or workload.", "Do not ask for updates in a group card.", "Do not assume a colleague would welcome a joke about being ill."],
    related: ["funny-get-well-soon-messages", "get-well-soon-messages-after-surgery", "short-get-well-soon-messages", "how-to-respond-to-get-well-soon"]
  },
  {
    slug: "get-well-soon-messages-for-friend",
    title: "Get Well Soon Messages for a Friend",
    dateModified: "2026-09-22",
    eyebrow: "Friendship notes",
    description: "Get well soon messages for a friend, with replies to health updates, everyday check-ins, practical help, and humor when it fits your friendship.",
    summary: "Friendly check-ins and replies when a friend shares health news.",
    intro: "Start with where your conversation is now. A first get well message can be a simple hello; a reply to a health update should acknowledge what your friend has just told you. Use words that sound like your usual conversations.",
    nav: "For a friend",
    sections: [
      {
        id: "quick",
        title: "Quick messages for a friend",
        messages: [
          "Thinking of you and hoping today feels a little easier.",
          "I hate that you are feeling so rough. Sending you love, rest, and a very gentle hug.",
          "Feel better soon, friend. I miss your face and your chaos.",
          "No need to reply. Just wanted you to know I am thinking of you."
        ],
        links: [
          { slug: "get-well-soon-text-messages", label: "They have just told you they are sick? Find short text replies." },
          { slug: "how-to-respond-to-get-well-soon", label: "You received the get well wish? Find ways to say thank you." }
        ]
      },
      {
        id: "warm",
        title: "Warm and heartfelt",
        messages: [
          "You have shown up for me so many times. Let me show up for you now, even if that just means food, errands, or quiet company.",
          "I know this is hard. You do not have to be cheerful for anyone. I am here for you exactly as you are today.",
          "I am sending every bit of love I can from here. I hope you feel cared for and a little less alone."
        ]
      },
      {
        id: "funny",
        title: "Funny messages for a close friend",
        intro: "Keep the joke aimed at the situation, not at their pain.",
        messages: [
          "Please feel better soon. I am being forced to make my own decisions and it is not going well.",
          "Get well soon. I need you back to your usual level of questionable advice.",
          "I would bring soup, but we both know snacks are the real comfort food. Feel better soon."
        ]
      },
      {
        id: "help",
        title: "Messages with practical help",
        messages: [
          "I can bring food, run an errand, or sit quietly with you this week. Pick the least annoying option.",
          "Want company, distraction, snacks, or total silence today? Any answer is fine.",
          "I am free Thursday if groceries, a ride, or a low-effort visit would make the day easier."
        ]
      },
      {
        id: "long-recovery",
        title: "For a long recovery",
        intro: "You do not need a new reassurance for every update. Respond to the feeling or detail they shared, and leave room for the everyday things you usually talk about. If they have not answered an offer of help, give them time rather than treating silence as a rejection.",
        messages: [
          "I know this is not over just because the first hard day passed. I am still here.",
          "You do not have to give me a cheerful update. I care about the real version of today.",
          "Thinking of you again this week. If you feel like talking, I would love to hear about whatever is on your mind."
        ],
        links: [
          { slug: "what-to-say-instead-of-get-well-soon", label: "When getting well soon does not fit, choose a different kind of support." },
          { slug: "get-well-soon-messages-for-cancer", label: "Writing to a friend with cancer? Find messages for treatment and everyday contact." }
        ]
      },
      {
        id: "surgery",
        title: "For a friend after surgery",
        messages: [
          "I am glad the surgery is behind you. Now please let yourself rest and be annoyingly cared for.",
          "No need to reply. I am thinking of you after surgery and hoping today is as gentle as possible.",
          "I can drop off food, send distractions, or leave you alone in peace. You get to choose."
        ]
      }
    ],
    decisionGuide: {
      title: "Reply to a friend's health update",
      intro: "These examples continue a conversation your friend has started. Acknowledge what they have already told you instead of asking them to repeat it. Offer a call or help only when you can follow through.",
      items: [
        {
          label: "They have said they are scared",
          useWhen: "Respond to that fear without promising that everything will be fine or asking again how they feel.",
          try: "I hear how scared you are. I wish I could make this easier. I can listen if you want to talk."
        },
        {
          label: "They send test results you do not understand",
          useWhen: "You can care about the person without interpreting the results. Do not guess what the numbers mean or make them explain everything to receive support.",
          try: "I do not understand all the details, but I am glad you told me. I care about what you are going through."
        },
        {
          label: "They are tired of talking about their health",
          useWhen: "Follow their request to change the subject. Choose an interest you really share, and let them decide whether to chat.",
          try: "We can talk about something else. I have some very unimportant news from my day if you feel like a distraction."
        },
        {
          label: "Another update brings more waiting",
          useWhen: "They have already described the uncertainty. Acknowledge that it continues without inventing a positive outcome.",
          try: "I am sorry you are still waiting for answers. You can keep talking to me about it; you do not have to have good news."
        }
      ]
    },
    faqs: [
      {
        question: "What should I text a sick friend?",
        answer: "Use a friendly, low-pressure note: No need to reply. Just wanted you to know I am thinking of you and sending love."
      },
      {
        question: "How can I make a get well message for a friend feel personal?",
        answer: "Sound like yourself and offer something real, such as food, errands, a ride, a distraction, or quiet company."
      },
      {
        question: "What if I keep saying the same thing when my friend shares health updates?",
        answer: "Reply to one thing they have just told you: fear, frustration, waiting, or wanting a break from the subject. You do not need a new slogan or a solution each time. If they already said they are scared, acknowledge that instead of asking them to explain their feelings again. It is fine to say you do not understand a test result without trying to interpret it."
      },
      {
        question: "Can I send a funny get well message to a friend?",
        answer: "Yes, if humor is normal between you and your friend would welcome it now. Let them set the tone when they share difficult news. Keep the joke affectionate and away from pain or diagnosis."
      }
    ],
    dos: ["Sound like yourself.", "Offer a specific way to help.", "Let them be honest if the day is hard."],
    donts: ["Do not force positivity.", "Do not make the message about your anxiety.", "Do not ask for updates every day."],
    related: ["funny-get-well-soon-messages", "what-to-say-instead-of-get-well-soon", "get-well-soon-messages-after-surgery"]
  },
  {
    slug: "funny-get-well-soon-messages",
    dateModified: "2026-09-22",
    title: "Funny Get Well Soon Messages",
    eyebrow: "Light humor",
    description: "Funny get well soon messages that keep the joke light, kind, and appropriate for minor illness or close relationships.",
    summary: "Light humor that still feels kind.",
    intro: "A funny message works best when it sounds like your usual conversations and the person wants a laugh. Follow their sense of humor and mood. The diagnosis alone cannot tell you whether a joke will be welcome.",
    nav: "Funny messages",
    sections: [
      {
        id: "quick",
        title: "Quick funny messages",
        messages: [
          "Get well soon. Your germs have made their point.",
          "Please feel better soon. My best material is wasted when you are not here to laugh at it.",
          "Feel better soon. I have saved several jokes that are only funny if you are here to hear them.",
          "Get well soon. The world needs your nonsense back in circulation."
        ]
      },
      {
        id: "friend",
        title: "For a close friend",
        messages: [
          "I've saved you a very important update: the dog still believes every delivery is for him.",
          "Get well soon. I need someone to make bad choices with, and you are clearly my most qualified candidate.",
          "I've been saving my least impressive stories for you. Available whenever you want a distraction."
        ]
      },
      {
        id: "work",
        title: "For a coworker",
        messages: [
          "Get well soon. Someone scheduled a meeting that should have been an email, and we need your reaction.",
          "The office tried to function without you. We have notes. Feel better soon.",
          "Your chair looks too peaceful without you. Hope you get plenty of rest."
        ]
      }
    ],
    faqs: [
      {
        question: "When is a funny get well soon message appropriate?",
        answer: "Use humor when you know the person enjoys it and they seem open to a joke. Some people appreciate ordinary humor during a serious illness; others prefer a quiet note even for a minor illness. If you are unsure, start warmly and follow their lead."
      },
      {
        question: "What makes a funny get well message feel kind?",
        answer: "Make the joke about the situation, boredom, soup, germs, or missing their personality. Do not joke about pain, fear, or diagnosis."
      },
      {
        question: "Can I send a funny message to a coworker?",
        answer: "Only if you know them well. For most workplace notes, keep the message friendly, brief, and free of sarcasm."
      },
      {
        question: "When should I switch from funny to serious?",
        answer: "Switch when they say they do not want jokes, are trying to share something difficult, or you are unsure how your joke will land. Listen to what they are saying before trying to lighten the mood."
      }
    ],
    dos: ["Use humor when you know their style.", "Keep the joke affectionate.", "Let them change the tone without having to laugh along."],
    donts: ["Do not joke about pain.", "Do not joke about a diagnosis.", "Do not use sarcasm with a distant coworker."],
    related: ["get-well-soon-messages-for-friend", "get-well-soon-messages-for-coworker", "short-get-well-soon-messages"]
  },
  {
    slug: "short-get-well-soon-messages",
    title: "Short Get Well Soon Messages",
    eyebrow: "One-line notes",
    description: "Short get well soon messages for texts, cards, flowers, and quick notes that still feel warm.",
    summary: "One-line texts, card notes, and gift tags.",
    intro: "Short works when the channel is small, like a text, flower card, group card, Slack note, or gift tag. The best short message still feels personal.",
    nav: "Short messages",
    sections: [
      {
        id: "texts",
        title: "Short get well soon texts",
        messages: [
          "Feel better soon. I am thinking of you.",
          "Sending comfort and steady healing your way.",
          "Rest well. I hope today is easier.",
          "Wishing you comfort and steady rest.",
          "Thinking of you and sending love."
        ]
      },
      {
        id: "cards",
        title: "Short card messages",
        messages: [
          "May each day bring more comfort, strength, and rest.",
          "You are cared for, missed, and held in our thoughts.",
          "Take your time healing. We are with you."
        ]
      },
      {
        id: "serious",
        title: "Short messages for serious illness",
        messages: [
          "No need to reply. I am thinking of you today.",
          "I am here with you through this.",
          "Sending strength, comfort, and quiet support."
        ]
      }
    ],
    decisionGuide: {
      title: "Choose the right short message",
      intro: "Short does not have to mean cold. Pick the line that fits the channel and how much energy the person may have.",
      items: [
        {
          label: "Quick text",
          useWhen: "You want a simple check-in that does not require a reply.",
          try: "No need to reply. I am thinking of you today."
        },
        {
          label: "Small card",
          useWhen: "The card has limited space, such as flowers or a gift tag.",
          try: "Wishing you comfort, rest, and care."
        },
        {
          label: "Close relationship",
          useWhen: "You can be warmer without writing a long paragraph.",
          try: "Sending love and hoping today feels a little gentler."
        },
        {
          label: "Serious illness",
          useWhen: "Simple recovery language feels too rushed.",
          try: "I am here with you through this. No need to reply."
        }
      ]
    },
    faqs: [
      {
        question: "What is the shortest get well soon message?",
        answer: "Feel better soon. I am thinking of you. This works well for a text, flower card, or quick note."
      },
      {
        question: "How do I make a short message feel warm?",
        answer: "Add one personal detail or a low-pressure line, such as no need to reply or I am here if you need anything."
      },
      {
        question: "Are short messages okay for serious illness?",
        answer: "Yes, if the wording is careful. Use presence-focused lines like I am thinking of you today or I am here with you through this."
      }
    ],
    dos: ["Keep it clear.", "Add no need to reply when appropriate.", "Use warmer wording for close relationships."],
    donts: ["Do not be vague if you can be kind.", "Do not make a short note sound cold.", "Do not use cheerful cliches for serious illness."],
    related: ["get-well-soon-messages-after-surgery", "get-well-soon-messages-for-serious-illness", "what-to-say-instead-of-get-well-soon"]
  },
  {
    slug: "what-to-say-instead-of-get-well-soon",
    title: "Alternative to \"Get Well Soon\"",
    eyebrow: "Alternative wording",
    dateModified: "2026-09-22",
    description: "Alternatives to get well soon for chronic illness, serious illness, cancer, long recovery, mental health, and situations where simple recovery wishes feel wrong.",
    summary: "Choose words for ongoing illness, a flare, or uncertain recovery.",
    intro: "Some people welcome get well soon; others prefer a wish for comfort, relief, or company. Consider what they have told you, whether you mean an ongoing condition or a difficult day, and how you normally speak together.",
    nav: "Instead of get well soon",
    sections: [
      {
        id: "quick",
        title: "Quick alternatives",
        messages: [
          "I am thinking of you and hoping today is gentle.",
          "No need to reply. I just wanted you to know you are on my mind.",
          "I am here with you through this, whatever today looks like.",
          "Sending comfort, strength, and quiet support.",
          "I hope you get a little relief and a lot of care today."
        ]
      },
      {
        id: "chronic",
        title: "For everyday support with an ongoing condition",
        intro: "An ordinary check-in does not need to suggest that a lasting condition will disappear. Ask about their interests or offer company, without expecting a health update.",
        messages: [
          "I am thinking of you today. We can talk about how you are feeling, or about something else entirely.",
          "I hope today is as gentle as possible. You do not have to be upbeat for me.",
          "You are not a burden. I care about you, and I am here in whatever way helps most."
        ]
      },
      {
        id: "flare",
        title: "When symptoms have flared up",
        intro: "If they have described a flare or a particularly difficult day, you can wish for that part to ease without promising that the condition will go away. Follow their preference: some people use feel better soon for a flare, while others would rather hear a simple thinking of you.",
        messages: [
          "I am sorry today has been so rough. I hope you get some relief, and I am here if you want company.",
          "We can leave our plans open. I would like to see you, but there is no pressure to decide today."
        ]
      },
      {
        id: "serious",
        title: "For serious illness",
        messages: [
          "I am so sorry you are going through this. I am here to listen, help, or simply sit with you in it.",
          "There is no perfect thing to say, but I love you and I am not going anywhere.",
          "I am holding you close in my thoughts. No updates needed, no pressure to respond."
        ]
      }
    ],
    decisionGuide: {
      title: "Choose an alternative that fits the situation",
      intro: "There is no phrase that everyone prefers. Use what the person has shared instead of choosing words from a diagnosis alone.",
      items: [
        {
          label: "Everyday life with an ongoing condition",
          useWhen: "You want to stay in touch without making every conversation about health.",
          try: "I am thinking of you today. We can talk about how you are feeling, or about something else entirely."
        },
        {
          label: "A flare or a difficult day",
          useWhen: "They have told you their symptoms are worse and you want to acknowledge this moment.",
          try: "I am sorry today has been so rough. I hope you get some relief, and I am here if you want company."
        },
        {
          label: "You do not know the details",
          useWhen: "You want to show care without guessing what recovery will look like.",
          try: "No need to reply. I just wanted you to know you are on my mind."
        }
      ]
    },
    faqs: [
      {
        question: "What is a gentler alternative to \"get well soon\"?",
        answer: "Try: \"I am thinking of you and hoping today is gentle.\" It works when quick-recovery language feels too small for the situation."
      },
      {
        question: "When should I avoid saying get well soon?",
        answer: "Choose another phrase if they have said they dislike it, or if it would suggest a recovery timeline they are not expecting. Chronic or serious illness does not give everyone the same preference. If you are unsure, thinking of you offers care without making a prediction."
      },
      {
        question: "What can I say for chronic illness or a long recovery?",
        answer: "Distinguish everyday support from a flare or a separate short-term illness. You might wish them relief from today's symptoms or simply offer company. If they welcome get well soon for a cold or feel better soon for a flare, you do not need to replace their own preferred wording."
      },
      {
        question: "How do I sound supportive without being intense?",
        answer: "Keep the note short, remove pressure to respond, and offer one concrete form of help. A calm text is often easier to receive than a dramatic paragraph."
      }
    ],
    dos: ["Say I am thinking of you.", "Ask what kind of support would help right now.", "Remove pressure to reply."],
    donts: ["Do not say everything happens for a reason.", "Do not demand positivity.", "Do not promise they will be fine when you do not know that."],
    related: ["get-well-soon-messages-for-serious-illness", "short-get-well-soon-messages", "get-well-soon-messages-for-friend"]
  },
  {
    slug: "get-well-soon-messages-for-serious-illness",
    title: "Messages for Someone with a Serious Illness",
    eyebrow: "Careful support",
    dateModified: "2026-09-22",
    description: "Supportive messages for serious illness when recovery is uncertain and ordinary get well wishes feel too simple.",
    summary: "Supportive language when optimism needs restraint.",
    intro: "A first response to difficult news can be simple. Later messages can offer company, practical help, or an ordinary conversation. Let the person choose what they want to talk about, without promising an outcome or expecting frequent updates.",
    nav: "Serious illness",
    sections: [
      {
        id: "quick",
        title: "When you first hear the news",
        intro: "Acknowledge what they have shared. The first note can suit someone you know less well; phrases such as 'you are loved' and 'holding you close' fit a closer relationship.",
        messages: [
          "I am sorry to hear this. Thinking of you and wishing you comfort.",
          "No need to reply. I just wanted you to know you are loved and not alone.",
          "I would like to keep you company. Would a short call or a few texts suit you? It is fine if neither does today.",
          "I hope today brings some comfort. I am holding you close in my thoughts."
        ]
      },
      {
        id: "card",
        title: "Card messages",
        intro: "Write with the warmth you normally share. Choose a message that fits how close you are and what you can genuinely offer.",
        messages: [
          "There is no perfect message for something this hard. Please know I care about you deeply and I am here for whatever support looks like right now.",
          "You do not have to be strong for everyone. I hope you feel surrounded by care, patience, and people who will keep showing up.",
          "I am sending love for the hard days and steady care for whatever comes next. You are not facing this alone."
        ]
      },
      {
        id: "practical",
        title: "Later check-ins and practical help",
        intro: "Check what would be useful before making arrangements. They may already have meals or rides covered and prefer company, a familiar topic, or some quiet.",
        messages: [
          "I can bring dinner this week or run errands if that would help. No pressure to answer now.",
          "I am free on Thursday if you need a ride, a grocery run, or someone to sit with you.",
          "I do not want to add another thing to your plate. I will check in again next week, and you never have to respond quickly."
        ]
      }
    ],
    decisionGuide: {
      title: "Choose a first response or a later check-in",
      intro: "Support can change from one conversation to the next. Offer a choice instead of assuming they always want to discuss their illness.",
      items: [
        {
          label: "They have just told you",
          useWhen: "You want to acknowledge the news without trying to explain it or predict what happens next.",
          try: "I am sorry to hear this. Thinking of you and wishing you comfort."
        },
        {
          label: "You are staying in touch",
          useWhen: "You want to offer a way to connect that they can accept or decline.",
          try: "I would like to keep you company. Would a short call or a few texts suit you? It is fine if neither does today."
        },
        {
          label: "They would welcome ordinary conversation",
          useWhen: "They have shown interest in chatting about something outside their illness.",
          try: "I saw [something connected to a shared interest] and thought of you. I can send it over if you would like."
        }
      ]
    },
    faqs: [
      {
        question: "What can I say when the illness is serious and I do not know the outcome?",
        answer: "Say what is true without trying to predict anything: \"I am sorry to hear this. Thinking of you and wishing you comfort.\""
      },
      {
        question: "How do I check in without asking for updates?",
        answer: "You can send a short thinking-of-you note or mention a shared interest without asking about their health. Make a reply optional, but leave room for conversation if they want it. Some people want to talk about treatment; others would rather talk about ordinary life. Follow their lead."
      },
      {
        question: "Should I use hopeful language for serious illness?",
        answer: "Gentle hope is fine if it does not promise an outcome. Pair it with presence, patience, and practical help rather than telling them everything will be fine."
      },
      {
        question: "What should I avoid in a serious illness message?",
        answer: "Avoid comparisons, promised timelines, forced positivity, and repeated requests for updates. The person should not have to comfort you or perform bravery."
      }
    ],
    dos: ["Acknowledge that it is hard without trying to solve it.", "Offer support without needing a response.", "Be specific if offering help."],
    donts: ["Do not promise they will be fine.", "Do not compare their illness to someone else's.", "Do not ask for repeated updates."],
    related: ["what-to-say-instead-of-get-well-soon", "short-get-well-soon-messages", "get-well-soon-messages-after-surgery"]
  },
  {
    slug: "get-well-soon-messages-for-family",
    title: "Get Well Soon Messages for Family",
    eyebrow: "Family support",
    description: "Warm get well soon messages for family members when you want to offer love, practical help, and steady support.",
    summary: "Warm messages for relatives, home care, and family cards.",
    intro: "Family messages can be direct and steady. Say they are loved, name the support around them, and avoid making them manage everyone else's worry.",
    nav: "For family",
    sections: [
      {
        id: "quick",
        title: "Quick family messages",
        messages: [
          "We love you and are thinking of you every day. Rest as much as you need.",
          "You are surrounded by family, care, and a lot of love. Wishing you comfort today.",
          "Take your time healing. We are here for whatever you need.",
          "Sending love from all of us and hoping today feels easier."
        ],
        links: [
          { slug: "get-well-soon-messages-for-wife", label: "For your wife: loving notes and specific offers of help." },
          { slug: "get-well-soon-messages-for-husband", label: "For your husband: texts, cards, and support through a longer recovery." }
        ]
      },
      {
        id: "card",
        title: "Family card messages",
        messages: [
          "Home feels different when you are not feeling like yourself. We love you and hope each day brings more strength.",
          "You have cared for us so many times. Please let us care for you now.",
          "We are with you through the quiet days, the hard days, and every step of recovery."
        ],
        links: [
          { slug: "get-well-soon-messages-for-grandma", label: "Writing to Grandma? Find cards and notes from grandchildren." }
        ]
      },
      {
        id: "serious",
        title: "For serious family illness",
        messages: [
          "There is no pressure to be strong for us. You are loved exactly as you are today.",
          "We are here for the long haul, not just the easy parts. You are not alone.",
          "Sending comfort, patience, and all the love our family can hold."
        ]
      }
    ],
    faqs: [
      {
        question: "What should I say to a sick family member?",
        answer: "Say they are loved, remind them they do not have to manage everyone else's worry, and offer one practical way you can help."
      },
      {
        question: "How do I write a family get well card from everyone?",
        answer: "Use a shared voice: We love you, we are thinking of you, and we are here for meals, rides, calls, or anything that makes recovery easier."
      },
      {
        question: "What should I avoid in a family illness message?",
        answer: "Avoid guilt about missed events, pressure around recovery timing, and messages that make the person comfort the rest of the family."
      }
    ],
    dos: ["Say we or I clearly.", "Offer help with meals, rides, or home tasks.", "Let them rest without updating everyone."],
    donts: ["Do not make them comfort the family.", "Do not push a recovery timeline.", "Do not use guilt about missed events."],
    related: ["get-well-soon-messages-for-mom", "get-well-soon-messages-for-dad", "get-well-soon-messages-for-serious-illness"]
  },
  {
    slug: "get-well-soon-messages-for-mom",
    title: "Get Well Soon Messages for Mom",
    dateModified: "2026-09-22",
    eyebrow: "For mom",
    description: "Loving get well soon messages for mom, with short notes, heartfelt cards, and support after surgery.",
    summary: "Loving notes for mom, from a short text to a heartfelt card.",
    intro: "A message for mom can be as simple as saying you love her and are thinking of her. Choose wording that reflects your relationship, and offer only the help you can give.",
    nav: "For mom",
    sections: [
      {
        id: "quick",
        title: "Quick messages for mom",
        intro: "Choose a note that sounds like you. Use the message about caring for 'all of us' if your mom has often looked after the family and you can offer care in return.",
        messages: [
          "Mom, I love you. I hope today brings you some comfort and rest.",
          "Thinking of you today and hoping you feel surrounded by comfort and love.",
          "You have cared for all of us so well. Now it is our turn to care for you.",
          "Rest well, Mom. I am sending all my love your way."
        ]
      },
      {
        id: "card",
        title: "Heartfelt card messages",
        intro: "Use 'we' only if you are writing for others too. The note about worrying about everyone else fits if she has mentioned those concerns.",
        messages: [
          "You are the heart of our family, and we are all holding you close as you recover.",
          "I wish I could make this easier. Until then, I will keep showing up however I can.",
          "Please do not worry about anyone else right now. We love you, and we want you to rest."
        ]
      },
      {
        id: "surgery",
        title: "After surgery",
        messages: [
          "Mom, I am grateful the surgery is behind you. Take every day slowly and let your body heal.",
          "Wishing you peaceful rest and all the care you deserve. I love you more than I can fit in a card.",
          "You do not have to rush back to normal. We are here, and we love you."
        ]
      }
    ],
    faqs: [
      {
        question: "What is a good get well message for mom?",
        answer: "A simple message can tell her she is loved and in your thoughts: Mom, I love you. I hope today brings you some comfort and rest."
      },
      {
        question: "What can I write to my mom after surgery?",
        answer: "Keep it gentle and reassuring. Say you are grateful the surgery is behind her, then offer help with food, calls, errands, or quiet company."
      },
      {
        question: "How do I make a message for mom more personal?",
        answer: "Mention a shared memory, a favorite way to spend time together, or one specific thing you can help with. If she often looks after others, you can acknowledge that and offer to handle a task she usually takes on."
      }
    ],
    dos: ["Make the love explicit.", "Match the wording to your relationship.", "Offer concrete help."],
    donts: ["Do not ask her to reassure you.", "Do not minimize her pain.", "Do not rush her back into family duties."],
    related: ["get-well-soon-messages-for-family", "get-well-soon-messages-after-surgery", "short-get-well-soon-messages"]
  },
  {
    slug: "get-well-soon-messages-for-dad",
    title: "Get Well Soon Messages for Dad",
    eyebrow: "For dad",
    description: "Steady get well soon messages for dad when you want to show love, respect, and practical support without overdoing it.",
    summary: "Steady, warm messages for dad during recovery.",
    intro: "A message for dad does not need to be elaborate. Steady affection, respect, and practical support usually land best.",
    nav: "For dad",
    sections: [
      {
        id: "quick",
        title: "Quick messages for dad",
        messages: [
          "Dad, I am thinking of you and wishing you steady healing.",
          "Rest up and take things slowly. We love you and are here for you.",
          "Hoping today brings more comfort and strength. Love you, Dad.",
          "You do not have to power through this. Please rest and let us help."
        ]
      },
      {
        id: "card",
        title: "Heartfelt card messages",
        messages: [
          "You have always been strong for us, but you do not have to be strong every minute. We love you exactly as you are.",
          "I am grateful for you every day. Wishing you comfort, rest, and a recovery that gets easier with time.",
          "Dad, we are all on your side. Take your time healing, and know you are deeply loved."
        ]
      },
      {
        id: "surgery",
        title: "After surgery",
        messages: [
          "I am glad the surgery is over. Now your only job is to rest, heal, and let people help.",
          "Wishing you a calm recovery and more strength each day. Love you, Dad.",
          "Take it one day at a time. We are here for rides, meals, errands, and anything else."
        ]
      }
    ],
    faqs: [
      {
        question: "What should I write in a get well card for dad?",
        answer: "Use steady, plain language: Dad, I am thinking of you, I love you, and I am here for anything that would make this easier."
      },
      {
        question: "How do I support a dad who does not like emotional messages?",
        answer: "Keep the note short and practical. Offer rides, meals, errands, or help at home, and let the love show through what you are willing to do."
      },
      {
        question: "What should I avoid saying to dad during recovery?",
        answer: "Avoid pressuring him to be tough, joking when he seems worried, or making him feel he has to minimize pain for everyone else."
      }
    ],
    dos: ["Keep the wording steady.", "Make support practical.", "Respect privacy if he is not expressive."],
    donts: ["Do not pressure him to be tough.", "Do not joke if he seems worried.", "Do not skip saying love if you mean it."],
    related: ["get-well-soon-messages-for-family", "get-well-soon-messages-after-surgery", "get-well-soon-messages-for-serious-illness"]
  },
  {
    slug: "get-well-soon-messages-for-boss",
    title: "Get Well Soon Messages for Boss",
    dateModified: "2026-09-22",
    eyebrow: "Professional support",
    description: "Get well soon messages for a boss or manager, with short replies when they say they are unwell, a brief email, and wishes from the team.",
    summary: "Respectful messages for managers and team leaders.",
    intro: "If your boss has told you they are unwell, you can reply with a brief acknowledgment and a kind wish. Use the greeting you normally use together, or choose a separate note for a team card or surgery recovery.",
    nav: "For boss",
    sections: [
      {
        id: "quick",
        title: "Quick professional messages",
        messages: [
          "Wishing you a steady recovery and plenty of rest. Please take care of yourself.",
          "I am sorry to hear you have been unwell. Sending best wishes for a steady recovery.",
          "Hope you are able to rest and feel better soon. I am thinking of you.",
          "Wishing you comfort, rest, and recovery in your own time."
        ]
      },
      {
        id: "reply-to-sick-notice",
        title: "Reply to a boss who says they are unwell",
        nav: "Reply to their message",
        intro: "These are replies to your manager's own news about being ill. A short response can show care without asking what happened or making promises about work. If you are replying in an email thread, keep its existing subject line.",
        messages: [
          "Thank you for letting me know. I am sorry you are feeling unwell, and I hope you feel better soon.",
          "Sorry to hear that. I hope you can get some rest and feel more comfortable soon.",
          "Hi [Name],\n\nThank you for letting me know. I am sorry to hear you are unwell and wish you a restful recovery.\n\nBest wishes,\n[Your name]"
        ],
        links: [
          { slug: "how-to-respond-to-get-well-soon", label: "Did your boss send you get well wishes? Find ways to thank them instead." }
        ]
      },
      {
        id: "team",
        title: "From the team",
        intro: "Use we when the people signing the card share the message. For a note from you alone, use I.",
        messages: [
          "The team is thinking of you and wishing you a restful recovery. Please take the time you need.",
          "We appreciate everything you do and hope you are getting the rest you need to recover well.",
          "Sending warm wishes from all of us. We look forward to seeing you when you are ready."
        ]
      },
      {
        id: "surgery",
        title: "After surgery",
        messages: [
          "Wishing you a steady recovery after surgery. Please focus on rest and healing.",
          "I hope each day after your procedure brings more comfort and strength.",
          "Sending best wishes for rest, comfort, and an unhurried return."
        ]
      }
    ],
    decisionGuide: {
      title: "Choose the right boss message",
      intro: "A note to a manager should remove work pressure. Keep the tone respectful, especially if the team is signing together.",
      items: [
        {
          label: "Reply to their sick-day message",
          useWhen: "Your manager has told you directly that they are unwell.",
          try: "Thank you for letting me know. I am sorry you are feeling unwell, and I hope you feel better soon."
        },
        {
          label: "From the team",
          useWhen: "Several people are signing one card.",
          try: "The team is thinking of you and wishing you a restful recovery. Please take the time you need."
        },
        {
          label: "After surgery",
          useWhen: "They shared that they had a procedure, but you should not ask details.",
          try: "Wishing you a steady recovery after surgery. Please focus on rest and care."
        },
        {
          label: "Very formal workplace",
          useWhen: "You want the note polished and concise.",
          try: "Please accept my best wishes for comfort and a steady recovery."
        }
      ]
    },
    faqs: [
      {
        question: "How formal should a get well message to a boss be?",
        answer: "Use a respectful tone and keep it brief. Warmth is fine, but avoid private questions, jokes, or anything that mentions work pressure."
      },
      {
        question: "Is one sentence enough when my boss emails to say they are sick?",
        answer: "A brief acknowledgment and a kind wish can be enough for a personal reply: Thanks for letting me know. I hope you feel better soon. Match the tone of your usual emails; you do not need a long expression of sympathy. A message sent to the whole team may not need a reply from everyone, so consider how your team normally handles those notices."
      },
      {
        question: "How do I reply if my boss wishes me get well soon?",
        answer: "That is a thank-you message because you are the one who is unwell. Try: Thank you for checking in. I appreciate your kind wishes. You can keep it brief without adding medical details or promising when you will return."
      },
      {
        question: "Can the team sign one get well card for a manager?",
        answer: "Yes. A group note works well if it focuses on care and rest: The team is thinking of you, and we hope you can take the time you need."
      },
      {
        question: "What should I avoid saying to my boss?",
        answer: "Do not mention urgent decisions, deadlines, coverage gaps, or questions about what happened medically."
      }
    ],
    dos: ["Use your usual respectful tone.", "Make it clear whether the note is from you or the team.", "Keep caring wishes separate from work requests."],
    donts: ["Do not mention urgent decisions.", "Do not ask what happened.", "Do not overdo humor."],
    related: ["get-well-soon-messages-for-coworker", "get-well-soon-messages-after-surgery", "short-get-well-soon-messages", "how-to-respond-to-get-well-soon"]
  },
  {
    slug: "get-well-soon-messages-for-client",
    title: "Get Well Soon Messages for a Client",
    seoTitle: "Get Well Soon Messages for a Client: Short Replies & Emails",
    dateModified: "2026-09-22",
    eyebrow: "Client wording",
    description: "Find short get well replies when a client says they are sick, plus optional emails, team card messages, and support during an ongoing illness.",
    summary: "Short replies to client illness news, with optional email examples.",
    intro: "If a client or customer tells you they are unwell, a short, kind reply may be all you need. Start with the replies below, or choose a complete email if you are reaching out separately.",
    nav: "For a client",
    personalizationSteps: [
      "Use the greeting and level of formality from your usual correspondence. Replace every bracketed name, date, role, and company before sending.",
      "Acknowledge only what the client has shared or has agreed can be shared. Leave diagnoses out of the subject line and avoid asking for medical details.",
      "Check any promise about dates, cover, or next steps with the people authorized to agree it. If nothing is confirmed, send a support-only note and handle work arrangements separately."
    ],
    sections: [
      {
        id: "quick",
        title: "Short replies when a client says they are sick",
        nav: "Reply to their news",
        intro: "Use these in the conversation where the client shared the news, including when they say replies may be slower. You do not need to start a new email or add a long expression of sympathy. Choose the more conversational wording if that matches your usual relationship.",
        messages: [
          "Thank you for letting me know. I am sorry you are feeling unwell, and I hope you feel better soon.",
          "Sorry to hear you are feeling so rough. I hope you can get some rest and feel better soon.",
          "I am sorry to hear you have been unwell. Wishing you rest, comfort, and better days ahead.",
          "Please accept my best wishes for comfort, rest, and steady healing."
        ]
      },
      {
        id: "email",
        title: "An email for a client you do not know well",
        nav: "Formal email",
        intro: "Use a complete email if you are reaching out separately. A formal note can be warm without assuming closeness: keep the greeting you usually use and choose a discreet subject line. The shorter option can also close an existing email.",
        messages: [
          "Subject: Best wishes\n\nDear [Client's usual title and surname],\n\nI was sorry to hear you have been unwell. Please accept my best wishes for comfort and care. There is no need to reply to this message.\n\nKind regards,\n[Your name]\n[Your role], [Company name]",
          "I hope you are feeling supported and have the space you need to recover."
        ]
      },
      {
        id: "familiar-client",
        title: "An email for a client you know well",
        nav: "Familiar client",
        intro: "Use a first name only if you normally do. This version suits an established working relationship; adjust the reference to working together so it is true for you.",
        messages: [
          "Subject: Thinking of you\n\nHi [First name],\n\nI wanted to send a note to wish you well. I have really enjoyed working with you over the years, and I was sorry to hear you have been unwell.\n\nI hope you have some restful days and good support around you. No need to reply; I just wanted you to know I am thinking of you.\n\nWarm wishes,\n[Your name]\n[Company name]"
        ]
      },
      {
        id: "serious",
        title: "Support during a serious or ongoing illness",
        nav: "Ongoing illness",
        intro: "Use these when a client has shared a difficult or continuing situation. A later note can show care without asking for an update, predicting recovery, or bringing work into the message.",
        messages: [
          "I am very sorry to hear what you are going through. Please accept my warmest thoughts and wishes for comfort and strength.",
          "Sending sincere support during this difficult time. No response needed.",
          "Wishing you comfort, care, and support in the days ahead.",
          "Subject: A note of support\n\nDear [Client's usual name],\n\nI wanted to send a quiet note to say I am thinking of you during this difficult time. I hope you have the care and support you need around you.\n\nThere is no need to share an update or reply. Please accept my warmest wishes for comfort in the days ahead.\n\nWith best wishes,\n[Your name]\n[Company name]"
        ]
      },
      {
        id: "team-card",
        title: "A card from your company or team",
        nav: "Team cards",
        intro: "Use a shared voice only for people who are actually sending the card. Include your team or company name so the recipient knows who it is from.",
        messages: [
          "All of us at [Company name] are thinking of you and sending warm wishes for comfort and care. No reply is needed.\n\nWith best wishes,\nThe [Team name] team",
          "Sending warm wishes from everyone on the [Team name] team. We hope you feel supported during this time.\n\nWith kind regards,\n[Company name]"
        ]
      },
      {
        id: "confirmed-arrangements",
        title: "When project arrangements have already been confirmed",
        nav: "Confirmed plans",
        intro: "Use these only after the relevant people on both sides have approved the dates, contacts, and responsibilities, and you have confirmed that no action is needed from the client. Replace every bracketed detail. If you cannot make that promise, send a support-only note and coordinate internally or with an existing agreed contact in a separate message. Do not assume you can extend a deadline.",
        messages: [
          "I was sorry to hear you have been unwell. Please take care of yourself. [Agreed contact] and I have confirmed the revised arrangements for [specific item]. No reply to this note is needed.",
          "Wishing you a steady recovery. The next step on [specific item] will be handled by [agreed contact], as already arranged.",
          "Subject: Best wishes and confirmed arrangements for [project]\n\nDear [Client's usual name],\n\nI was sorry to hear you have been unwell and wanted to send my best wishes.\n\nFollowing our teams' agreement, [specific meeting or deliverable] has moved from [original date] to [agreed date]. [Colleague] will coordinate the next step with [existing client contact], so no action is needed from you on this arrangement.\n\nPlease take care of yourself. No reply to this note is needed.\n\nKind regards,\n[Your name]\n[Your role], [Company name]"
        ]
      }
    ],
    decisionGuide: {
      title: "Choose the right client message",
      intro: "Match the note to your existing relationship and what you actually know. A caring message does not need to discuss work.",
      items: [
        {
          label: "Reply to news they have shared",
          useWhen: "A client says they are unwell or will be slower to reply.",
          try: "Thank you for letting me know. I am sorry you are feeling unwell, and I hope you feel better soon."
        },
        {
          label: "A familiar client",
          useWhen: "A warmer tone already feels natural in your correspondence.",
          try: "I wanted to send a quick note to say I am thinking of you. I hope you have good support around you. No need to reply."
        },
        {
          label: "Serious or ongoing illness",
          useWhen: "Recovery language may not fit what the client has shared.",
          try: "Sending sincere support during this difficult time. No response needed."
        },
        {
          label: "Confirmed work arrangements",
          useWhen: "Authorized contacts have already agreed the arrangement, and no action is needed from the client.",
          try: "The next step on [specific item] will be handled by [agreed contact], as already arranged. No reply to this note is needed."
        }
      ]
    },
    faqs: [
      {
        question: "How formal should a get well message to a client be?",
        answer: "Follow the tone of your usual correspondence. Use a title and surname if that is normal, or a first name for an established relationship. A short wish for comfort is enough; you do not need personal questions, jokes, or details about the illness."
      },
      {
        question: "What should I reply when a client says they are sick and may respond slowly?",
        answer: "Acknowledge the message and add a kind wish: Thank you for letting me know. I am sorry you are feeling unwell, and I hope you feel better soon. This can stay in the existing conversation. You do not need to ask about the illness or promise a deadline change to show concern."
      },
      {
        question: "What subject line should I use for a client get well email?",
        answer: "Use a simple subject such as Best wishes, Thinking of you, or A note of support. Leave diagnoses and other private health details out of the subject line, and send the note only to the intended recipient rather than copying a wider group."
      },
      {
        question: "Can I say there is no rush on our side?",
        answer: "Only if you have authority to make that commitment and it is accurate. Check dates and responsibilities with the relevant people first. A specific confirmed change is clearer than an open-ended promise. If arrangements are unresolved, send a caring note without promising a delay and handle the coordination separately."
      },
      {
        question: "What should I avoid in a client get well message?",
        answer: "Avoid private medical questions, unconfirmed deadline promises, sales offers, and requests for decisions. Do not ask when they will be back. For a serious or ongoing illness, offer steady support without predicting an outcome or asking for repeated updates."
      }
    ],
    dos: [
      "Match the formality of your usual correspondence.",
      "Keep health details private and make a reply optional.",
      "Verify any promise about dates, cover, or next steps before sending."
    ],
    donts: [
      "Do not ask for medical details.",
      "Do not turn a caring note into a sales or work request.",
      "Do not promise a delay or completed handover that has not been agreed."
    ],
    related: [
      "get-well-soon-messages-for-boss",
      "short-get-well-soon-messages",
      "get-well-soon-messages-for-serious-illness"
    ]
  },
  {
    slug: "get-well-soon-messages-for-boyfriend",
    title: "Get Well Soon Messages for Boyfriend",
    eyebrow: "Romantic support",
    description: "Sweet get well soon messages for your boyfriend that mix affection, practical care, and space to rest.",
    summary: "Sweet, practical, and affectionate messages for him.",
    intro: "A message for your boyfriend can be loving without becoming dramatic. Mix affection with practical care and permission to rest.",
    nav: "For boyfriend",
    sections: [
      {
        id: "quick",
        title: "Quick messages for your boyfriend",
        messages: [
          "I love you. Rest up and let me take care of the little things.",
          "Wish I could make this easier. I am sending love, comfort, and a very gentle hug.",
          "Feel better soon, babe. I miss your energy and your terrible jokes.",
          "No pressure to reply. Just wanted you to know I am thinking of you."
        ]
      },
      {
        id: "heartfelt",
        title: "Heartfelt messages",
        messages: [
          "You do not have to be strong every second. I love you on the hard days too.",
          "I am here for medicine runs, soup, quiet nights, and whatever helps you feel cared for.",
          "Recovery can be slow, but you do not have to do it alone. I am with you."
        ]
      },
      {
        id: "surgery",
        title: "After surgery",
        messages: [
          "I am so glad the surgery is behind you. Now let your body heal while I spoil you responsibly.",
          "Take recovery one day at a time. I love you, and I am not going anywhere.",
          "Your only job is to rest. I can handle food, errands, and reminders to stop pretending you are fine."
        ]
      }
    ],
    faqs: [
      {
        question: "What should I text my boyfriend when he is sick?",
        answer: "Send something affectionate and low pressure: I love you. No need to reply. Rest up and let me handle the little things."
      },
      {
        question: "How do I write a message for my boyfriend after surgery?",
        answer: "Say you are glad surgery is behind him, encourage slow recovery, and offer specific help like food, errands, or company."
      },
      {
        question: "Can a get well message for my boyfriend be funny?",
        answer: "Yes, if he is dealing with a minor illness or already joking. If he is scared, in pain, or recovering from surgery, keep it tender."
      }
    ],
    dos: ["Be affectionate.", "Offer practical care.", "Let him rest without performing confidence."],
    donts: ["Do not make him reassure you.", "Do not pressure him to reply.", "Do not turn pain into a joke unless he does first."],
    related: ["get-well-soon-messages-after-surgery", "funny-get-well-soon-messages", "short-get-well-soon-messages"]
  },
  {
    slug: "get-well-soon-messages-for-girlfriend",
    title: "Get Well Soon Messages for Girlfriend",
    eyebrow: "Romantic support",
    description: "Thoughtful get well soon messages for your girlfriend that feel tender, specific, and easy to receive.",
    summary: "Tender messages for comfort, care, and recovery.",
    intro: "A message for your girlfriend should feel personal. Be tender, be specific, and make it clear she does not need to be cheerful for you.",
    nav: "For girlfriend",
    sections: [
      {
        id: "quick",
        title: "Quick messages for your girlfriend",
        messages: [
          "I love you. I hope today feels softer and easier on your body.",
          "Rest as much as you need. I am thinking of you and sending all my love.",
          "No need to reply, love. Just wanted you to know you are on my mind.",
          "Feel better soon. I miss you, and I am here for anything you need."
        ]
      },
      {
        id: "heartfelt",
        title: "Heartfelt messages",
        messages: [
          "I wish I could take the hard part away. Since I cannot, I will keep showing up with love, patience, and whatever helps.",
          "You do not have to be positive or brave for me. I love you exactly as you are today.",
          "Let yourself rest. You are cared for, cherished, and never a burden."
        ]
      },
      {
        id: "surgery",
        title: "After surgery",
        messages: [
          "I am grateful the surgery is over. Now please let yourself heal slowly and be taken care of.",
          "Wishing you peaceful rest and steady healing. I love you more than any message can say.",
          "Take recovery one day at a time. I will be here for every quiet day and every small win."
        ]
      }
    ],
    faqs: [
      {
        question: "What should I say to my girlfriend when she is sick?",
        answer: "Use a tender, specific line: I love you. No need to reply. I hope today feels softer and I am here for anything you need."
      },
      {
        question: "How do I make a message for my girlfriend feel less generic?",
        answer: "Mention what you can actually do for her, such as bringing food, handling an errand, calling later, or giving her quiet space."
      },
      {
        question: "What should I avoid saying to my girlfriend during recovery?",
        answer: "Avoid minimizing how she feels, asking her to stay cheerful for you, or making your worry something she has to manage."
      }
    ],
    dos: ["Use her name if it feels natural.", "Offer specific care.", "Make room for hard feelings."],
    donts: ["Do not minimize the illness.", "Do not overpromise a recovery timeline.", "Do not make the note generic."],
    related: ["get-well-soon-messages-after-surgery", "what-to-say-instead-of-get-well-soon", "short-get-well-soon-messages"]
  },
  {
    slug: "religious-get-well-soon-messages",
    title: "Religious Get Well Soon Messages",
    eyebrow: "Faith and comfort",
    description: "Religious get well soon messages, prayers, and faith-based wishes for cards, texts, family, friends, and surgery recovery.",
    summary: "Faith-based wishes for comfort and healing.",
    intro: "Religious messages work best when faith is already part of the relationship. Keep the tone comforting, humble, and free of blame.",
    nav: "Religious messages",
    sections: [
      {
        id: "quick",
        title: "Quick religious messages",
        messages: [
          "Praying for comfort, strength, and peace today.",
          "May God surround you with peace, rest, and care as you recover.",
          "You are in my prayers. May each day bring more comfort.",
          "Praying that you feel held, loved, and strengthened through this."
        ]
      },
      {
        id: "card",
        title: "Religious card messages",
        messages: [
          "May God's peace be close to you in every hard moment and every quiet hour of recovery.",
          "I am praying for your body, your spirit, and the people caring for you.",
          "May you feel God's presence around you and the love of everyone praying for you."
        ]
      },
      {
        id: "surgery",
        title: "After surgery",
        messages: [
          "Praying for peace, patience, and support after surgery.",
          "May God stay close to you and bring peace to each day of recovery.",
          "Thankful your surgery is behind you and praying for comfort as you rest."
        ]
      }
    ],
    decisionGuide: {
      title: "Choose the right religious message",
      intro: "Faith language is personal. Use it when you know it will comfort the person, and keep the focus on peace, care, and support.",
      items: [
        {
          label: "Shared faith",
          useWhen: "You know religious wording is welcome.",
          try: "Praying for comfort, strength, and peace today."
        },
        {
          label: "After surgery",
          useWhen: "They had a procedure and may need patience more than a big statement.",
          try: "Praying for peace, patience, and support after surgery."
        },
        {
          label: "Serious illness",
          useWhen: "Avoid explanations or promises, and keep the prayer humble.",
          try: "May God's peace be close to you in every hard moment and every quiet hour."
        },
        {
          label: "Unsure about faith",
          useWhen: "You are not certain they welcome religious language.",
          try: "Sending warm thoughts, comfort, and steady support today."
        }
      ]
    },
    faqs: [
      {
        question: "When is a religious get well message appropriate?",
        answer: "Use one when faith is already part of the relationship or you know the person welcomes religious language."
      },
      {
        question: "How do I keep a faith-based message comforting?",
        answer: "Pray for peace, strength, care, and support. Avoid explaining why the illness happened or implying the person needs more faith."
      },
      {
        question: "Can I send a religious message after surgery?",
        answer: "Yes, if it fits the relationship. Keep it gentle and focused on comfort, patience, and the people caring for them."
      }
    ],
    dos: ["Use faith language they share.", "Pray for comfort, strength, and peace.", "Keep the message gentle."],
    donts: ["Do not suggest illness is a test.", "Do not blame a lack of faith.", "Do not use religious language with someone who would not welcome it."],
    related: ["get-well-soon-prayers", "get-well-soon-messages-for-family", "get-well-soon-messages-for-serious-illness"]
  },
  {
    slug: "get-well-soon-prayers",
    title: "Get Well Soon Prayers",
    eyebrow: "Prayer wording",
    description: "Get well soon prayers for healing, comfort, surgery recovery, serious illness, family, friends, and cards.",
    summary: "Prayer wording for healing, peace, and strength.",
    intro: "A prayer can be short and sincere. Focus on comfort, care, wisdom for caregivers, and peace for the person recovering.",
    nav: "Prayers",
    sections: [
      {
        id: "short",
        title: "Short get well prayers",
        messages: [
          "Lord, bring comfort, rest, and steady support today. Amen.",
          "God, please surround them with peace and strength as they recover. Amen.",
          "May they feel loved, cared for, and less alone through every hour. Amen.",
          "Lord, bring calm to painful moments and strength for today. Amen."
        ]
      },
      {
        id: "surgery",
        title: "Prayers after surgery",
        messages: [
          "God, thank you for the care they have received. Please bring peace, patience, and strength for the days ahead. Amen.",
          "Lord, help their mind rest and bless everyone caring for them. Amen.",
          "May today bring more comfort, less fear, and the support they need. Amen."
        ]
      },
      {
        id: "serious",
        title: "Prayers for serious illness",
        messages: [
          "God, be near in this difficult season. Bring comfort, courage, and the right support for every need. Amen.",
          "Lord, hold them close when the days are heavy and surround them with love that does not fade. Amen.",
          "May peace enter the room, strength meet every fear, and care arrive in practical ways. Amen."
        ]
      }
    ],
    decisionGuide: {
      title: "Choose the right prayer",
      intro: "A prayer can be short, specific, and gentle. Avoid turning illness into a lesson or making promises about what will happen.",
      items: [
        {
          label: "Short card prayer",
          useWhen: "You need one or two lines for a card.",
          try: "Lord, bring comfort, rest, and steady support today. Amen."
        },
        {
          label: "After surgery",
          useWhen: "You want to pray for recovery days without rushing them.",
          try: "God, please bring peace, patience, and strength for the days ahead. Amen."
        },
        {
          label: "Serious illness",
          useWhen: "The situation is heavy and certainty would feel wrong.",
          try: "God, be near in this difficult season. Bring comfort, courage, and the right support for every need. Amen."
        },
        {
          label: "For caregivers",
          useWhen: "You want to include the people helping them.",
          try: "Lord, give wisdom and steadiness to everyone caring for them today. Amen."
        }
      ]
    },
    faqs: [
      {
        question: "What should a get well prayer focus on?",
        answer: "Focus on comfort, peace, strength, caregivers, and practical support. Avoid making promises about outcomes."
      },
      {
        question: "Can I write a short prayer in a card?",
        answer: "Yes. One or two sincere lines are enough, especially if the person is tired or the card space is small."
      },
      {
        question: "What should I avoid in a prayer for serious illness?",
        answer: "Avoid explaining the illness, blaming faith, or making the person feel responsible for staying hopeful."
      }
    ],
    dos: ["Pray for comfort and care.", "Keep the prayer simple.", "Respect the person's beliefs."],
    donts: ["Do not make theological claims about why they are sick.", "Do not promise an outcome.", "Do not use prayer to avoid practical help."],
    related: ["religious-get-well-soon-messages", "get-well-soon-messages-for-serious-illness", "get-well-soon-messages-after-surgery"]
  },
  {
    slug: "get-well-soon-card-messages",
    dateModified: "2026-09-22",
    title: "Get Well Soon Card Messages",
    eyebrow: "Card wording",
    description: "Get well soon card messages that fit handwritten notes, group cards, flowers, and recovery gifts.",
    summary: "Messages that fit handwritten cards and gift notes.",
    intro: "Wondering what to write inside a get well card? Start with their name, add a short wish and one real detail, then sign it. Choose a ready-to-use line below or adapt a complete card. A few thoughtful sentences are enough; you do not have to fill the space.",
    nav: "Card messages",
    sections: [
      {
        id: "quick",
        title: "Quick card messages",
        messages: [
          "Wishing you comfort, rest, and steady healing. You are in my thoughts.",
          "May each day bring more strength and a little more ease.",
          "Sending love and warm wishes as you recover.",
          "Take your time healing. You are cared for more than you know."
        ]
      },
      {
        id: "warm",
        title: "Longer card messages",
        messages: [
          "I am sorry this season has been so hard. I hope this card brings a little comfort and reminds you that you are not facing it alone.",
          "You have so many people thinking of you and wishing you peace. I am one of them, today and every day.",
          "I hope recovery brings quieter days, gentle progress, and the support you need around you."
        ],
        links: [
          { slug: "get-well-soon-messages-for-teacher", label: "Writing a class card? Find complete get well cards for a teacher." }
        ]
      },
      {
        id: "complete-card",
        title: "A complete get well card, from greeting to signature",
        nav: "Complete card",
        intro: "Replace the bracketed details before sending. Use a shared interest only if it is real, and choose the name and closing you normally use with this person. A memory can lead into something from today rather than making the whole card a look back.",
        messages: [
          "Dear [Name],\n\nThinking of you and hoping you have some comfortable moments today. [A small piece of news or a shared interest] made me think of you, so I wanted to send a note.\n\nWith love,\n[Your name]",
          "Hi [Name],\n\nJust a note to wish you well and let you know I'm thinking of you. I hope you are able to get some rest.\n\nBest wishes,\n[Your name]"
        ]
      },
      {
        id: "flowers",
        title: "Flower and gift card notes",
        messages: [
          "A little brightness for your room and a lot of love for your day.",
          "Sending these with warm thoughts and hopes for a gentle recovery.",
          "May this small gift remind you that you are loved and remembered."
        ]
      }
    ],
    faqs: [
      {
        question: "What should I write in a get well soon card?",
        answer: "Write one warm sentence, add a personal line, and close with support. For example: Thinking of you and wishing you comfort, rest, and good care."
      },
      {
        question: "How long should a get well card message be?",
        answer: "Two to four sentences is usually enough. For a small flower card or group card, one sincere line can be better than a long paragraph."
      },
      {
        question: "What should a group get well card say?",
        answer: "Use shared support without pressure: We are thinking of you, we hope you can rest, and we are sending warm wishes from all of us."
      },
      {
        question: "What if I do not know the person very well?",
        answer: "Keep the card respectful and short. Use comfort, care, and privacy-focused wording instead of jokes, personal questions, or emotional language that assumes closeness."
      }
    ],
    personalizationSteps: [
      "Open with their name. Hi suits an everyday note; Dear also works for a more traditional card.",
      "Choose one message and add a true detail if you want to: a shared interest, a small update, or a specific offer you can carry out.",
      "Finish with your usual closing and signature. With love suits a close relationship; Best wishes works when you know them less well."
    ],
    dos: ["Add one personal detail.", "Write clearly enough to read by hand.", "Choose a closing that fits your relationship."],
    donts: ["Do not fill the whole card with filler.", "Do not choose a joke card unless you know they would enjoy it.", "Do not ask for a reply."],
    related: ["short-get-well-soon-messages", "get-well-soon-text-messages", "get-well-soon-messages-after-surgery"]
  },
  {
    slug: "get-well-soon-text-messages",
    title: "Get Well Soon Text Messages",
    dateModified: "2026-09-22",
    eyebrow: "Texts",
    description: "Short get well soon texts for check-ins and replies when someone says they are sick, home after surgery, or having a painful day.",
    summary: "Short check-ins and replies to someone who says they are unwell.",
    intro: "Choose a quick check-in or a reply to what someone has just told you. A short acknowledgment and a kind wish can be enough; you do not need to turn every text into a question about their health.",
    nav: "Text messages",
    sections: [
      {
        id: "quick",
        title: "Quick texts",
        intro: "These start a conversation or send a quiet reminder that you care. For an ongoing conversation, use the reply examples in Choose wording below.",
        messages: [
          "Thinking of you and hoping today is a little easier.",
          "No need to reply. Just sending love and support.",
          "Feel better soon. I am here if you need anything specific.",
          "Rest well and take things one hour at a time."
        ],
        links: [
          { slug: "how-to-respond-to-get-well-soon", label: "Someone wished you well? Choose a thank-you reply instead." }
        ]
      },
      {
        id: "checkin",
        title: "Check-in texts",
        intro: "Offer only what you can do. If a previous message has gone unanswered, leave room for them to rest; they do not owe an explanation or a health report.",
        messages: [
          "Want company, distraction, food, or total silence today? Any answer is fine.",
          "I can drop off groceries later if that helps. No pressure to respond quickly.",
          "Just checking in gently. I hope you are getting some rest."
        ]
      },
      {
        id: "serious",
        title: "Serious illness texts",
        messages: [
          "I am thinking of you. No updates needed, no pressure to answer.",
          "I am here to listen or help in practical ways whenever you want.",
          "Sending quiet support today. You are not alone."
        ]
      }
    ],
    decisionGuide: {
      title: "What to text back when someone says they are sick",
      intro: "These are replies to the person who is unwell. Match the wording to what they actually said; do not assume that surgery went well or that pain will pass quickly.",
      items: [
        {
          label: "They say they are sick today",
          useWhen: "For a brief everyday illness update, acknowledge it and wish them well without asking for symptoms.",
          try: "Sorry you are feeling rough. I hope you can get some rest and feel better soon."
        },
        {
          label: "They say they are home after surgery",
          useWhen: "Acknowledge the stage they described. Keep questions and plans for a visit out of the reply unless they invite them.",
          try: "Thank you for letting me know you are home. Wishing you rest and comfort after the surgery. No need to text back."
        },
        {
          label: "They say today is painful",
          useWhen: "Respond to how today feels without guessing the cause or promising when the pain will end.",
          try: "I am sorry today is so painful. Thinking of you and hoping you get some relief."
        },
        {
          label: "They say they are too tired to chat",
          useWhen: "Accept that boundary and close the exchange without adding another question.",
          try: "Of course. No need to keep texting; we can catch up another time. Sending you love."
        }
      ]
    },
    faqs: [
      {
        question: "What is a good get well soon text?",
        answer: "Try: No need to reply. I just wanted you to know I am thinking of you and hoping today feels easier."
      },
      {
        question: "Should I add no need to reply?",
        answer: "Yes when the person may be tired, in treatment, recovering from surgery, or overwhelmed. It makes the text easier to receive."
      },
      {
        question: "How often should I text someone who is sick?",
        answer: "Follow their preferences and your usual contact with them rather than a fixed schedule. If they say they want company, keep the conversation going; if they need quiet or have not replied, leave space. A later hello can share something ordinary without asking for another health update."
      },
      {
        question: "How do I respond when someone texts that they are sick?",
        answer: "Acknowledge the news and offer a short wish, such as Sorry you are feeling rough. I hope you can get some rest. If they mention surgery or pain, respond to that detail without guessing the outcome. This is different from thanking someone who has sent you a get well wish."
      }
    ],
    dos: ["Keep it easy to receive.", "Say no need to reply.", "Offer one specific help option."],
    donts: ["Do not send a wall of text.", "Do not ask for medical updates repeatedly.", "Do not use too many cheerful slogans."],
    related: ["short-get-well-soon-messages", "get-well-soon-messages-for-friend", "what-to-say-instead-of-get-well-soon"]
  },
  {
    slug: "get-well-soon-messages-for-hospital-stay",
    title: "Get Well Soon Messages for a Hospital Stay",
    eyebrow: "Hospital stay",
    description: "Get well soon messages for someone in the hospital that feel calm, private, and easy to receive.",
    summary: "Comforting notes for hospital rooms, flowers, and texts.",
    intro: "Hospital messages should feel calm and low-pressure. They should offer comfort without asking for medical details, constant updates, or visitor access.",
    nav: "Hospital stay",
    sections: [
      {
        id: "quick",
        title: "Quick hospital messages",
        messages: [
          "Thinking of you and hoping the hospital days feel a little less lonely.",
          "Sending a quiet reminder that you are cared about while you are in the hospital.",
          "No need to reply. I just wanted you to know I am thinking of you.",
          "I hope you feel cared for by everyone around you today."
        ]
      },
      {
        id: "flowers",
        title: "Flower card messages",
        messages: [
          "A little brightness for your room and a lot of love from me.",
          "Sending these with warm thoughts and hopes for comfort today.",
          "May this bring a small smile and a reminder that you are loved."
        ]
      },
      {
        id: "support",
        title: "Supportive messages",
        messages: [
          "Hospitals can feel exhausting. I hope you get moments of rest, kindness, and calm today.",
          "I am here for rides, errands, updates to others, or anything that would make this easier.",
          "You do not have to entertain visitors or reply quickly. Just know I care."
        ]
      }
    ],
    faqs: [
      {
        question: "What should I text someone who is in the hospital?",
        answer: "Try: \"No need to reply. I just wanted you to know I am thinking of you.\" It is short, kind, and does not ask them to explain anything."
      },
      {
        question: "How do I send support without asking private questions?",
        answer: "Focus on comfort instead of details. Say you are thinking of them, offer one practical help option, and let them decide how much they want to share."
      },
      {
        question: "What can I write on hospital flowers?",
        answer: "Keep a flower card simple: \"A little brightness for your room and a lot of love from me.\" Short messages work well in a hospital setting."
      },
      {
        question: "Should I visit someone in the hospital?",
        answer: "Ask first or check with a close family member. Hospital stays can be tiring, and a supportive message should respect privacy, rest, and visiting limits."
      }
    ],
    dos: ["Keep it low-pressure.", "Offer help outside the hospital.", "Respect privacy and visiting boundaries."],
    donts: ["Do not ask for private medical details.", "Do not demand updates.", "Do not assume visitors are always wanted."],
    related: ["get-well-soon-card-messages", "get-well-soon-text-messages", "get-well-soon-messages-for-serious-illness"]
  },
  {
    slug: "get-well-soon-messages-for-injury",
    title: "Get Well Soon Messages for Injury",
    eyebrow: "Injury recovery",
    description: "Get well soon messages for injury recovery that acknowledge pain, frustration, and slow physical healing.",
    summary: "Messages for injuries, accidents, and physical recovery.",
    intro: "Injury recovery can be frustrating because progress is visible but slow. A good message acknowledges the annoyance and offers practical help.",
    nav: "Injury recovery",
    sections: [
      {
        id: "quick",
        title: "Quick injury recovery messages",
        messages: [
          "I know recovery from an injury can be frustrating. Hoping today brings a little more comfort.",
          "Wishing you steady healing and fewer annoying limitations each day.",
          "Rest up and let your body do its repair work.",
          "Hope today feels a little easier and the recovery routine is less frustrating."
        ]
      },
      {
        id: "funny",
        title: "Funny injury messages",
        messages: [
          "Heal up soon. I will save the jokes until you are cleared for laughing.",
          "Please rest dramatically. Your comeback story needs a strong ending.",
          "Get well soon. I assume this was all part of your plan to avoid chores."
        ]
      },
      {
        id: "support",
        title: "Supportive injury messages",
        messages: [
          "If you need rides, groceries, or help with anything awkward while you recover, I am in.",
          "You do not have to rush healing. I hope each day feels a little more manageable.",
          "Sending patience for the boring parts and strength for the painful parts."
        ]
      }
    ],
    faqs: [
      {
        question: "What is a good message for someone recovering from an injury?",
        answer: "Acknowledge that recovery can be frustrating, wish them patience and comfort, and offer practical help with errands, rides, or tasks."
      },
      {
        question: "Is humor okay in an injury get well message?",
        answer: "Only if the injury is not severe and you know they enjoy that kind of humor. Keep the joke about the inconvenience, not their pain."
      },
      {
        question: "What should I avoid saying after an accident?",
        answer: "Do not make them retell what happened, compare injuries, or say it could have been worse."
      },
      {
        question: "How can I offer practical help after an injury?",
        answer: "Name one task that limited movement makes harder, such as rides, groceries, carrying things, meals, or an errand that can be handled without asking them to coordinate much."
      }
    ],
    dos: ["Acknowledge frustration.", "Offer help with mobility or errands.", "Use humor only if the injury is not severe."],
    donts: ["Do not say it could have been worse.", "Do not make them retell the accident.", "Do not push them to hurry back."],
    related: ["funny-get-well-soon-messages", "get-well-soon-messages-after-surgery", "short-get-well-soon-messages"]
  },
  {
    slug: "get-well-soon-messages-for-grandma",
    title: "Get Well Soon Messages for Grandma",
    seoTitle: "Get Well Soon Messages for Grandma: Texts & Cards",
    dateModified: "2026-09-22",
    eyebrow: "For grandma",
    description: "Loving get well messages for Grandma, with short texts, cards, everyday news, and ways to stay close when you cannot visit.",
    summary: "Loving texts and cards for Grandma, nearby or far away.",
    intro: "Find a short text, heartfelt card, or gentle check-in for Grandma. Use the name you call her and share something from your day, a familiar interest, or a memory that fits the conversation. There are examples for after surgery, being far apart, and a longer recovery.",
    nav: "For grandma",
    personalizationSteps: [
      "Use your usual name for her, such as Grandma, Nana, or Gran, and sign with the family name she knows you by.",
      "Share one true detail from today, such as something you made, noticed, or watched. A memory can connect to that detail; you do not have to sum up your whole relationship.",
      "If you offer a visit, call, or errand, make it something you can do and let her choose whether it would help."
    ],
    sections: [
      {
        id: "quick",
        title: "Short get well messages for Grandma",
        nav: "Short notes",
        messages: [
          "Grandma, I love you and hope today brings you more comfort and rest.",
          "Thinking of you and sending all my love as you recover.",
          "Rest well, Grandma. You are loved more than words can say.",
          "Just a little hello, Nana. No need to write back; I wanted to send you some love."
        ]
      },
      {
        id: "card",
        title: "Heartfelt card messages",
        intro: "If a card full of memories feels too much like a goodbye, start with something happening now. A memory can lead into a small story from your day instead of a summary of her life. In the recipe example, replace the activity and details with something you actually did; only mention a photo or drawing if you include it.",
        nav: "Heartfelt cards",
        messages: [
          "You have given our family so much love. Now I hope you feel that love coming back to you as you heal.",
          "Grandma, I tried your recipe today. Mine did not look quite like yours, but I enjoyed making it. It made me think of our afternoons in the kitchen. Sending you lots of love.",
          "Dear Grandma,\n\nI wish I could make these days easier. I love you, and I am here for a chat, some quiet company, or whatever feels comfortable for you. There is no need to be the host when I visit.\n\nWith love,\n[Your name]"
        ]
      },
      {
        id: "surgery",
        title: "Messages for Grandma after surgery",
        nav: "After surgery",
        intro: "Keep the focus on comfort and company. If you offer practical help, choose a task you can take on and check what she would prefer.",
        messages: [
          "I am grateful the surgery is behind you, Grandma. Wishing you a calm and steady recovery.",
          "Grandma, I can bring your book and glasses over this afternoon if you would like them. You do not need to stay awake for a visit.",
          "Sending a gentle hug after your surgery. I hope you have a comfortable place to rest and people listening to what you need."
        ]
      },
      {
        id: "far-away",
        title: "When you cannot visit Grandma",
        nav: "Far away",
        intro: "You can acknowledge the distance without making her feel responsible for your sadness. Offer an easy way to stay connected that does not require an immediate response.",
        messages: [
          "Grandma, I wish I could sit beside you today. I am sending a voice message for whenever you feel like listening. No need to send one back.",
          "We may be far apart, but you are part of my day. I saw your favorite flowers on my walk and thought of you. Sending a photo and lots of love.",
          "Nana, I can call for a few minutes this weekend if that would be nice. It is also fine to leave it for another day if you need quiet.",
          "I cannot be there this week, Grandma, but I can arrange a grocery delivery if you would find that useful. I love you and am thinking of you."
        ]
      },
      {
        id: "young-grandchildren",
        title: "Simple notes from little grandchildren",
        nav: "From children",
        intro: "Let a young child choose the words or tell you what to write. A drawing, a sticker, and one honest sentence are enough; only mention an item if it is included.",
        messages: [
          "I love you, Grandma. I drew you a rainbow for your room.",
          "Nana, I hope you feel better. This is my favorite sticker, and I want you to have it.",
          "Grandma, I wish I could give you a hug. I am sending you one in this card.",
          "Get well soon, Grandma. I saw a funny dog today and wanted to tell you about it. I love you!"
        ]
      },
      {
        id: "ongoing-recovery",
        title: "Checking in during a longer recovery",
        nav: "Later check-ins",
        intro: "A later message does not need a new way to say get well soon. Share a little news from your own day as well as showing interest in hers. You might mention a hobby, a family pet, or a show you both enjoy without requiring an answer. Let her lead if she wants to talk about something more serious.",
        messages: [
          "No big update needed, Grandma. I am still thinking of you and sending love this week.",
          "I know some days are harder than others. You do not have to put on a cheerful face with me, Nana. I love you just as much on a difficult day.",
          "Grandma, if you feel like a call, we can talk about your favorite show or anything else you choose. We do not have to talk about how you are feeling.",
          "I can keep picking up your groceries on Fridays this month, if that would be useful. You do not need to host me when I drop them off. Love you, Grandma."
        ]
      }
    ],
    faqs: [
      {
        question: "What should I write to my grandma when she is sick?",
        answer: "Use the name you usually call her, say you love her, and add one personal detail. A short note such as Grandma, I am thinking of you and sending lots of love is enough. If she has a serious or ongoing illness, focus on comfort and being there rather than predicting when she will feel better."
      },
      {
        question: "What can I say to Grandma when I cannot visit?",
        answer: "Acknowledge the distance briefly, then offer a way to connect: a short call, a photo, or a voice note she can hear when she wants. Avoid making her console you about being far away, and say that she does not need to reply."
      },
      {
        question: "What can a young grandchild write in a get well card?",
        answer: "A simple I love you, Grandma with a drawing is enough. Let the child dictate a sentence in their own words. They do not need to understand or describe the illness, and the card does not need to sound like an adult wrote it."
      },
      {
        question: "How do I keep checking in during a long recovery?",
        answer: "Send a small everyday detail or a loving hello without asking for a health report each time. If you can help regularly, offer a specific task and time. Follow her preference for calls, messages, visits, or quiet."
      },
      {
        question: "How can I write to Grandma without making the card sound like a goodbye?",
        answer: "Start with an ordinary hello and something from your day, then add a simple line of love. If you share a memory, connect it to something happening now, such as trying a recipe she taught you. Memories are not automatically a farewell, but you do not need to write a tribute or recap her life. Follow her lead if she wants a more serious conversation."
      },
      {
        question: "What should I avoid in a message for Grandma?",
        answer: "Avoid asking for frequent updates, making her reassure you, or rushing her recovery. Do not imply that she needs to get better to look after the family again. Use religious wording only if it fits her beliefs."
      }
    ],
    dos: ["Use the family name and tone she knows.", "Share a small memory or everyday detail.", "Offer help that fits her preferences and your availability."],
    donts: ["Do not make her comfort you.", "Do not pressure her around recovery timing.", "Do not ask for a health update in every message."],
    related: ["get-well-soon-messages-for-family", "get-well-soon-messages-for-mom", "get-well-soon-messages-after-surgery"]
  },
  {
    slug: "get-well-soon-messages-for-grandpa",
    title: "Get Well Soon Messages for Grandpa",
    eyebrow: "For grandpa",
    description: "Thoughtful get well soon messages for grandpa that sound steady, respectful, and genuinely supportive.",
    summary: "Respectful, warm messages for grandpa while he heals.",
    intro: "A message for grandpa can be simple and sincere. Keep the tone steady, make the love clear, and give him permission to rest.",
    nav: "For grandpa",
    sections: [
      {
        id: "quick",
        title: "Quick messages for grandpa",
        messages: [
          "Grandpa, I am thinking of you and wishing you steady healing.",
          "Rest up and take things slowly. We love you and are here for you.",
          "Hope today brings more comfort and strength. Love you, Grandpa.",
          "You do not have to push through this. Please rest and let us help."
        ]
      },
      {
        id: "card",
        title: "Heartfelt card messages",
        messages: [
          "You have always been such a steady presence in our family. I hope you feel that steadiness and love around you now.",
          "Grandpa, we are all on your side. Take your time healing, and know you are deeply loved.",
          "Wishing you quiet rest, good care, and more strength with each day."
        ]
      },
      {
        id: "surgery",
        title: "After surgery",
        messages: [
          "I am glad the surgery is over, Grandpa. Now your only job is to rest and heal.",
          "Wishing you a calm recovery and more comfort each day.",
          "Take it one day at a time. We are here for rides, meals, errands, and anything else."
        ]
      }
    ],
    faqs: [
      {
        question: "What is a good get well message for grandpa?",
        answer: "Try a steady line such as: Grandpa, I am thinking of you and wishing you comfort, rest, and good care today."
      },
      {
        question: "How do I write a respectful message for grandpa after surgery?",
        answer: "Say you are glad the surgery is behind him, encourage rest, and offer practical support like rides, meals, or help at home."
      },
      {
        question: "Can I keep a message for grandpa very short?",
        answer: "Yes. A short, sincere note often works best, especially if he does not like overly emotional wording."
      },
      {
        question: "How do I avoid making grandpa feel pressured?",
        answer: "Avoid telling him to be tough or hurry back. Say he is loved, encourage rest, and offer practical help without asking for a long update."
      }
    ],
    dos: ["Keep the wording steady.", "Make support practical.", "Say love clearly if that fits your relationship."],
    donts: ["Do not pressure him to be tough.", "Do not joke if he seems worried.", "Do not ask him to minimize how hard it feels."],
    related: ["get-well-soon-messages-for-family", "get-well-soon-messages-for-dad", "get-well-soon-messages-after-surgery"]
  },
  {
    slug: "get-well-soon-messages-for-sister",
    title: "Get Well Soon Messages for Sister",
    eyebrow: "For sister",
    description: "Get well soon messages for your sister, from affectionate texts to honest support when recovery feels hard.",
    summary: "Sweet, sibling-style messages for your sister.",
    intro: "A sister message can be affectionate, honest, and a little more personal. Match the tone to your relationship and the seriousness of what she is facing.",
    nav: "For sister",
    sections: [
      {
        id: "quick",
        title: "Quick messages for your sister",
        messages: [
          "Thinking of you, sis. I hope today feels easier and you get real rest.",
          "I love you and hate that you are going through this. Please let me help.",
          "Feel better soon, sister. I miss your energy and your opinions.",
          "No need to reply. Just sending love and support."
        ]
      },
      {
        id: "heartfelt",
        title: "Heartfelt sister messages",
        messages: [
          "You do not have to act fine with me. I am here for the honest version of today.",
          "You have always shown up for me. Let me show up for you now.",
          "I hope you feel cared for, protected, and less alone while you heal."
        ]
      },
      {
        id: "funny",
        title: "Funny messages for your sister",
        messages: [
          "Get well soon. I cannot be the only dramatic one in this family.",
          "Please feel better soon. I need someone to judge people with me.",
          "Feel better soon, because I am saving all family gossip until you are ready."
        ]
      }
    ],
    faqs: [
      {
        question: "What should I text my sister when she is sick?",
        answer: "Use the tone of your relationship. A good option is: Thinking of you, sis. No need to reply. I love you and I am here."
      },
      {
        question: "Can I send a funny get well message to my sister?",
        answer: "Yes, if the illness is minor or she usually jokes with you. For serious illness or surgery, keep the humor gentle or skip it."
      },
      {
        question: "How can I make a sister message more supportive?",
        answer: "Offer something specific, like dropping off food, handling an errand, calling later, or sitting with her during a hard day."
      },
      {
        question: "What if my sister does not want to talk?",
        answer: "Send a one-way note that does not require a reply. Let her know you love her, you are available, and silence is completely okay."
      }
    ],
    dos: ["Sound like your actual relationship.", "Offer a specific errand or check-in.", "Use humor only when the situation is mild."],
    donts: ["Do not make her reassure you.", "Do not joke about serious illness.", "Do not pressure her to reply."],
    related: ["get-well-soon-messages-for-family", "funny-get-well-soon-messages", "what-to-say-instead-of-get-well-soon"]
  },
  {
    slug: "get-well-soon-messages-for-brother",
    title: "Get Well Soon Messages for Brother",
    eyebrow: "For brother",
    description: "Get well soon messages for your brother that balance natural sibling tone with real support.",
    summary: "Supportive and funny messages for your brother.",
    intro: "A brother message can be short, warm, or lightly funny. If the illness is serious, skip the teasing and keep the support steady.",
    nav: "For brother",
    sections: [
      {
        id: "quick",
        title: "Quick messages for your brother",
        messages: [
          "Thinking of you, brother. Hope today brings more comfort.",
          "Rest up and heal well. I am here if you need anything.",
          "Feel better soon. The family is thinking of you.",
          "No need to reply. Just wanted you to know I have your back."
        ]
      },
      {
        id: "support",
        title: "Supportive brother messages",
        messages: [
          "You do not have to tough this out alone. I am here for rides, food, errands, or whatever helps.",
          "I know this is frustrating. I hope each day brings less pain and more strength.",
          "Take your time recovering. We are not going anywhere."
        ]
      },
      {
        id: "funny",
        title: "Funny messages for your brother",
        messages: [
          "Get well soon. I need my backup for family events.",
          "Please feel better soon. I am running out of people to annoy.",
          "Feel better soon. I promise to be only moderately annoying while you heal."
        ]
      }
    ],
    faqs: [
      {
        question: "What should I say to my brother when he is recovering?",
        answer: "Say you have his back, then offer concrete help. A simple message is: Rest up. I am here for food, rides, errands, or anything else."
      },
      {
        question: "Is it okay to tease my brother in a get well message?",
        answer: "Only if the situation is minor and teasing is normal between you. Avoid jokes about pain, fear, or anything medically serious."
      },
      {
        question: "How do I write a serious get well message for my brother?",
        answer: "Skip the jokes and use direct support: I know this is hard. You do not have to tough it out alone."
      },
      {
        question: "What if my brother does not like emotional messages?",
        answer: "Keep it practical and steady. A short line plus a concrete offer, such as food, a ride, or help with errands, can feel supportive without sounding dramatic."
      }
    ],
    dos: ["Keep it natural.", "Offer concrete help.", "Switch to serious support when needed."],
    donts: ["Do not overdo teasing.", "Do not make him prove he is fine.", "Do not ask for medical details he does not want to share."],
    related: ["get-well-soon-messages-for-family", "funny-get-well-soon-messages", "get-well-soon-messages-for-injury"]
  },
  {
    slug: "get-well-soon-messages-for-teacher",
    title: "Get Well Soon Messages for a Teacher",
    printableCards: {
      id: "teacher-get-well-cards",
      title: "Free printable get well cards for a teacher",
      intro: "Each pack has two single-page designs: a coloring card with room for a personal note, and a class card with 24 spaces for names or short wishes. Choose your paper size below. No sign-up needed.",
      designs: [
        {
          preview: "assets/printables/teacher-card-coloring-preview.png",
          alt: "Preview of the black-and-white teacher card with a picture to color and space for a handwritten note.",
          caption: "Page 1: Color the picture and add a note.",
          width: 480,
          height: 679
        },
        {
          preview: "assets/printables/teacher-card-class-preview.png",
          alt: "Preview of the class get well card with 24 boxes for names or short wishes.",
          caption: "Page 2: Collect wishes from the class.",
          width: 480,
          height: 679
        }
      ],
      files: [
        { path: "assets/printables/teacher-get-well-cards-a4-v1.pdf", paper: "a4", label: "Download A4 PDF (2 pages)" },
        { path: "assets/printables/teacher-get-well-cards-letter-v1.pdf", paper: "letter", label: "Download US Letter PDF (2 pages)" }
      ],
      steps: [
        "Download the pack that matches your printer paper: A4 or US Letter.",
        "Print page 1 or page 2, single-sided, in portrait at 100% / Actual size. Each page is a complete card; no folding is needed.",
        "Add your teacher's usual name, then write your own note or collect classmates' names and short wishes. For a larger class, print another copy of page 2.",
        "Free for personal and classroom use. Please link to this page when sharing the resource."
      ]
    },
    seoTitle: "Get Well Soon Messages for a Teacher: Cards & Notes",
    dateModified: "2026-09-22",
    eyebrow: "For a teacher",
    description: "Get well messages for a teacher from students, a class, or a parent, plus a brief email to a professor or former teacher when you are unsure what to say.",
    summary: "Student notes, class cards, parent messages, and professor emails.",
    intro: "Choose a note from one student, the whole class, or a parent, or find a brief email for a professor you do not know well. Add the name and title you normally use. Keep the focus on care, without asking when they will return.",
    nav: "For a teacher",
    personalizationSteps: [
      "Start with the title and name you normally use at school, rather than a first name unless that is usual for your class.",
      "Add one true detail about something they taught you or a kind thing they did. Keep requests about lessons in a separate school message.",
      "Sign with your name, your child's name if you are a parent, or the class name if everyone is signing. A reply is not needed."
    ],
    sections: [
      {
        id: "quick",
        title: "Short get well wishes for a teacher",
        nav: "Short notes",
        messages: [
          "Wishing you a restful recovery and plenty of care.",
          "We hope you feel better soon. Thank you for everything you do for us.",
          "Sending warm wishes from our class. Please take care of yourself.",
          "Thinking of you and hoping you have some comfortable, quiet time to rest."
        ]
      },
      {
        id: "young-student",
        title: "From a primary or elementary school student",
        nav: "Younger students",
        intro: "A young child's card should sound like them. Let them choose a sentence and add a drawing or one thing they enjoy about their teacher.",
        messages: [
          "I hope you feel better soon. Thank you for helping me when I get stuck.",
          "I made you this picture to say I am thinking of you. Sending you a big get well wish!",
          "I like the stories you read to us. I hope you have a good book to enjoy while you rest."
        ]
      },
      {
        id: "older-student",
        title: "From an older student",
        nav: "Older students",
        intro: "One specific thank-you can make a short note personal. Adapt the examples to something your teacher actually helped you with.",
        messages: [
          "I wanted to wish you well and thank you for making it easier to ask questions in class. I hope you are getting the rest and support you need.",
          "Your encouragement helped me feel more confident about my writing. I appreciate it, and I am thinking of you while you are away.",
          "Dear [Teacher's name],\n\nI am sorry you have been unwell. Thank you for the patience you showed me this term; it meant a lot. Wishing you comfort and rest, with no need to reply.\n\nBest wishes,\n[Your name]"
        ]
      },
      {
        id: "professor",
        title: "A brief email to a professor or former teacher",
        nav: "Professor or former teacher",
        intro: "If the teacher or department has shared that they are unwell, a brief note through your usual academic channel can be a considerate option. Follow any request for privacy or no messages. A former student can name the class and term so the teacher knows who is writing. Keep grade, reference, and coursework requests separate; you do not need to mention a diagnosis or guess what happened.",
        messages: [
          "Dear Professor [Surname],\n\nI took your [Course name] class in [Term/year]. I wanted to send my best wishes while you are away. Thank you for what I learned in your class. There is no need to reply.\n\nBest wishes,\n[Your name]"
        ]
      },
      {
        id: "class",
        title: "From the whole class: wishes and complete cards",
        nav: "Class cards",
        intro: "Use we for a group card and let each student sign if they would like to. The complete examples include a greeting and a closing; replace the names before sending.",
        messages: [
          "Our class is thinking of you and wishing you a restful recovery.",
          "We miss you and hope you are getting the rest you need to feel better.",
          "Thank you for being such a caring teacher. We hope you feel supported while you recover.",
          "Dear [Teacher's name],\n\nWe are sending you a card full of good wishes from our class. Thank you for helping us learn and for all the little ways you look after us. We hope you have plenty of rest and care while you are away.\n\nWith warm wishes,\nEveryone in [Class name]",
          "Dear [Teacher's name],\n\nWe wanted to let you know we are thinking of you. We appreciate the encouragement you give us and the way you make room for our questions. Wishing you comfort and support, with no need to send a reply.\n\nBest wishes from all of us,\n[Class name]"
        ]
      },
      {
        id: "parent",
        title: "From a parent",
        intro: "Use the school's usual communication channel. Keep lesson questions and administrative requests out of the get well note so the teacher does not feel expected to work while away.",
        nav: "Parents",
        messages: [
          "Wishing you rest and comfort. We appreciate your care and hope you can take the time you need.",
          "I am sorry to hear you have been unwell. [Child's name] wanted to send you this drawing and some warm wishes. No reply is needed.",
          "Thank you for the patience and encouragement you have shown our child. Our family is thinking of you and wishing you comfort while you recover."
        ]
      },
      {
        id: "long-absence",
        title: "When a teacher has been away for a while",
        nav: "Long absence",
        intro: "A later check-in can show that they are remembered without setting a deadline for their return. Avoid asking for progress reports or describing problems caused by their absence.",
        messages: [
          "Just a note to say our class is still thinking of you. Sending warm wishes this week, with no need to reply.",
          "I thought of your advice while working on my essay and wanted to say thank you again. I hope you feel cared for during this time away.",
          "We wanted to send another little hello from the class. You are remembered with a lot of affection, and we hope this card brings a kind moment to your day."
        ]
      }
    ],
    decisionGuide: {
      title: "Choose the right teacher message",
      intro: "Choose the writer first, then the format. A child's note, a class card, and a brief email from a former student can each show care without asking the teacher to respond.",
      items: [
        {
          label: "From one student",
          useWhen: "A child or teen is writing their own note.",
          try: "I hope you feel better soon. Thank you for helping me when I get stuck."
        },
        {
          label: "Professor or former teacher",
          useWhen: "They may need a reminder of which class you took. Use their usual title, identify yourself, and keep the note free of academic requests.",
          try: "I took your [Course name] class in [Term/year] and wanted to send my best wishes. I hope you are getting the rest and support you need. There is no need to reply."
        },
        {
          label: "From the class",
          useWhen: "Many students are signing one card or poster.",
          try: "Our class is thinking of you and wishing you rest, comfort, and a gentle recovery."
        },
        {
          label: "From a parent",
          useWhen: "A parent is emailing or writing a note to the teacher.",
          try: "Wishing you rest and comfort. We appreciate your care for our child, and there is no need to reply."
        },
        {
          label: "Long absence",
          useWhen: "You want to send another kind note without asking when the teacher will return.",
          try: "Our class is still thinking of you. Sending warm wishes this week, with no need to reply."
        }
      ]
    },
    faqs: [
      {
        question: "What should students write in a get well card for a teacher?",
        answer: "Start with a short wish for comfort or rest, then add a true thank-you. A younger student might write Thank you for helping me when I get stuck. An older student can mention a lesson or some encouragement that mattered to them. Sign with the student's name and avoid asking when the teacher will be back."
      },
      {
        question: "Is it okay to email a professor I do not know well with get well wishes?",
        answer: "A short note can be a considerate option if they or the department have shared the news and have not asked for privacy or no messages. Use your usual academic contact channel, briefly identify yourself, and send a simple good wish. Keep requests about marks, recommendations, and coursework separate. If you know only a rumor, do not repeat it or ask for medical details."
      },
      {
        question: "How do we write a get well card from the whole class?",
        answer: "Address the teacher as you normally do at school, use we in the message, and close with the class name or students' signatures. Two or three sentences of appreciation and good wishes are enough. Let students add a drawing or short note without sharing private information about the teacher's health."
      },
      {
        question: "What should a parent say to a teacher who is unwell?",
        answer: "Send a brief note through the usual school channel. Wish them comfort, thank them for their care, and identify your child if needed. Keep questions about schoolwork or cover arrangements in a separate message to the appropriate school contact."
      },
      {
        question: "What can I write when a teacher has been absent for a long time?",
        answer: "Say they are still in your thoughts and offer a small, specific thank-you. A later message does not need to ask how recovery is progressing. Avoid comments about falling behind or needing them back, and make clear that a reply is not expected."
      },
      {
        question: "Can a class get well card be cheerful?",
        answer: "Yes. Drawings, kind memories, and a warm greeting can make a card cheerful. Avoid jokes about the illness, demands to return, or guesses about their condition. Follow any guidance the school has shared about sending cards or messages."
      }
    ],
    dos: ["Use the teacher's usual title and name.", "Add a specific, sincere thank-you.", "Make clear who is signing the note."],
    donts: ["Do not ask for medical details.", "Do not bring up missed lessons or return dates.", "Do not expect a reply or use jokes about the illness."],
    related: ["short-get-well-soon-messages", "get-well-soon-card-messages", "get-well-soon-messages-for-coworker"]
  },
  {
    slug: "get-well-soon-messages-for-child",
    title: "Get Well Soon Messages for Child",
    eyebrow: "For a child",
    description: "Gentle get well soon messages for a child that feel simple, reassuring, and not scary.",
    summary: "Simple, cheerful notes that feel safe for kids.",
    intro: "A message for a child should be simple, warm, and not scary. Focus on comfort, small joys, and people who are caring for them.",
    nav: "For a child",
    sections: [
      {
        id: "quick",
        title: "Quick messages for a child",
        messages: [
          "Sending you a big gentle hug and lots of get-better wishes.",
          "Rest up, little star. We hope you feel better soon.",
          "You are brave, loved, and surrounded by people who care.",
          "Hope today brings more smiles and less yucky feeling."
        ]
      },
      {
        id: "card",
        title: "Card messages for kids",
        messages: [
          "This card is packed with hugs, smiles, and wishes for a better day.",
          "I hope you get cozy blankets, good stories, and lots of rest while you heal.",
          "You are doing a great job resting and getting better one day at a time."
        ]
      },
      {
        id: "funny",
        title: "Light and funny messages",
        messages: [
          "Get well soon. Your toys are asking when playtime starts again.",
          "Rest up and let the grown-ups bring snacks. That is the rule.",
          "Sending superhero strength for a better-feeling day."
        ]
      }
    ],
    decisionGuide: {
      title: "Choose the right child message",
      intro: "A child message should be simple enough to understand and gentle enough not to add fear. Match the note to the child's age and energy.",
      items: [
        {
          label: "Very young child",
          useWhen: "They need comfort more than explanation.",
          try: "Sending you gentle hugs, cozy blanket wishes, and lots of love today."
        },
        {
          label: "Older child",
          useWhen: "They can read a slightly more direct note.",
          try: "I hope today feels easier. You are loved, cared for, and allowed to rest."
        },
        {
          label: "Hospital or surgery",
          useWhen: "The situation may feel scary, so keep the language calm.",
          try: "Thinking of you and hoping the grown-ups around you are helping today feel a little safer and calmer."
        },
        {
          label: "Light humor",
          useWhen: "The child likes playful notes and the illness is not serious.",
          try: "Rest up. Your toys are saving your spot for when you feel ready to play again."
        }
      ]
    },
    faqs: [
      {
        question: "What should I write to a sick child?",
        answer: "Use simple, warm words. Mention hugs, comfort, stories, blankets, or small joys instead of medical details."
      },
      {
        question: "Can I call a child brave in a get well message?",
        answer: "Yes, but do not make bravery feel like a job. Pair it with reassurance that they are loved and cared for."
      },
      {
        question: "What should I avoid in a get well message for a child?",
        answer: "Avoid scary medical language, timelines, and anything that makes the child responsible for making adults feel better."
      }
    ],
    dos: ["Use simple words.", "Keep the tone reassuring.", "Mention comfort items or small joys."],
    donts: ["Do not use scary medical language.", "Do not promise a timeline.", "Do not make them feel responsible for being brave."],
    related: ["short-get-well-soon-messages", "get-well-soon-card-messages", "get-well-soon-messages-for-hospital-stay"]
  },
  {
    slug: "get-well-soon-messages-for-cancer",
    title: "Messages for Someone with Cancer",
    eyebrow: "Cancer support",
    dateModified: "2026-09-22",
    description: "Messages for someone with cancer: first responses, everyday conversation, reconnecting after a silence, and practical offers of support.",
    summary: "Careful support when simple recovery wishes may not fit.",
    intro: "You can acknowledge the news without making every message about cancer. Choose a first response, a practical offer, or an ordinary conversation that fits your relationship. Let them decide how much they want to share.",
    nav: "Cancer support",
    sections: [
      {
        id: "quick",
        title: "Short cancer support messages",
        intro: "Choose wording that fits how close you are. If you offer company or help, name something you can actually do.",
        messages: [
          "I am thinking of you today. No need to reply.",
          "Would you like a short call this week? I would be glad to listen or chat about something else.",
          "Sending comfort and steady support during appointments, waiting, and hard days.",
          "You are not alone. I care about you and I am here."
        ]
      },
      {
        id: "card",
        title: "Card messages for cancer",
        messages: [
          "There is no perfect thing to say, but I want you to know I am here and I care deeply.",
          "You do not have to be positive for me. I am here for the honest days too.",
          "I hope you feel surrounded by care, patience, and people who will keep showing up."
        ]
      },
      {
        id: "help",
        title: "Messages with practical help",
        intro: "Offer one thing you can do and check before making arrangements. Adapt the day or task to what is realistic for you.",
        messages: [
          "I can bring dinner one evening this week if that would help. No pressure to answer now.",
          "I am free Thursday and can pick up groceries if that would help.",
          "I do not want to add another task. I will check in again next week, and you never need to reply quickly."
        ]
      },
      {
        id: "treatment",
        title: "During treatment",
        messages: [
          "Thinking of you during treatment this week. I hope the day brings good care, quiet moments, and support that feels useful.",
          "I can help with a ride, a meal, or keeping people updated if that would take one thing off your plate.",
          "No need to respond. I am just sending steady support for appointments, waiting, and everything around them."
        ]
      },
      {
        id: "everyday",
        title: "Everyday conversation and reconnecting",
        intro: "A friend may want to talk about treatment, an ordinary interest, or nothing much today. Use a topic you really share and make company an invitation they can decline. If you have been quiet, a brief acknowledgment can reopen contact without asking them to reassure you.",
        messages: [
          "I saw [something connected to a shared interest] and thought you might enjoy it. Shall I send it over?",
          "Would you like to watch an episode of [shared show] together this week, in person or on a call? We can keep it short or leave it for another time.",
          "I am sorry I have been quiet. I was unsure what to say, but I care about you and wanted to get back in touch. I would love to chat whenever you feel like it."
        ]
      },
      {
        id: "uncertain",
        title: "For hard or uncertain days",
        messages: [
          "I will not try to make this sound simple. I care about you and I am here for the hard parts too.",
          "You do not have to be hopeful for me. I am here with you, whatever today looks like.",
          "There is no right way to feel right now. I care about you, and I am happy to listen if you want to talk."
        ]
      },
      {
        id: "not-close",
        title: "When you are not very close",
        messages: [
          "I am sorry to hear what you are going through. Wishing you comfort, privacy, and good support around you.",
          "Thinking of you and sending sincere support. No response needed.",
          "Please accept my warm thoughts during this difficult time."
        ]
      }
    ],
    decisionGuide: {
      title: "Choose the right cancer message",
      intro: "Start with the kind of contact they might welcome today. A practical offer, a health conversation, and a familiar everyday topic meet different needs; none has to be the choice every time.",
      items: [
        {
          label: "Newly shared news",
          useWhen: "They just told you about the diagnosis or treatment plan.",
          try: "I am so sorry you are going through this. I care about you and I am here with you through it."
        },
        {
          label: "During treatment",
          useWhen: "They are in appointments, waiting, or dealing with treatment routines.",
          try: "No need to respond. I am sending steady support for appointments, waiting, and everything around them."
        },
        {
          label: "Hard or uncertain day",
          useWhen: "You want to avoid forced positivity or promises.",
          try: "You do not have to be hopeful for me. I am here with you, whatever today looks like."
        },
        {
          label: "An ordinary chat or a gap in contact",
          useWhen: "You want to reconnect as a friend without asking for a medical update.",
          try: "I am sorry I have been quiet. I was unsure what to say, but I care about you and wanted to get back in touch. I would love to chat whenever you feel like it."
        },
        {
          label: "Not very close",
          useWhen: "A short, respectful card or email is more appropriate.",
          try: "I am sorry to hear what you are going through. Wishing you comfort, privacy, and good support around you."
        }
      ]
    },
    faqs: [
      {
        question: "What should I write to someone with cancer without promising recovery?",
        answer: "Try: \"I am thinking of you today. No need to reply.\" It is direct, caring, and does not ask them to manage your emotions."
      },
      {
        question: "Is it okay to say get well soon to someone with cancer?",
        answer: "It depends on their preference and what they have shared. Some welcome the familiar wish; others prefer words that do not suggest a recovery deadline. If you are unsure, thinking of you or a specific offer of company avoids predicting an outcome."
      },
      {
        question: "How can I offer help during cancer treatment?",
        answer: "Offer one thing you can do, such as a meal, a ride, or a grocery run, and check before arranging it. They may already have practical help and prefer company or a normal chat. Only share updates with other people if they have asked you to and agreed what can be shared."
      },
      {
        question: "What if I have not contacted my friend for a while?",
        answer: "Acknowledge the gap briefly, say you care, and offer an easy way to reconnect. Avoid a long explanation that makes them reassure you. You can suggest a shared interest or a short chat without asking for a health update; let them decide whether and when to respond."
      },
      {
        question: "What should I avoid in a cancer card?",
        answer: "Avoid stay positive, battle language if you do not know they use it, promises about the outcome, and comparisons to someone else's cancer story."
      }
    ],
    dos: ["Say you are present.", "Offer specific practical help.", "Remove pressure to reply."],
    donts: ["Do not tell them to stay positive.", "Do not promise an outcome.", "Do not compare their cancer to someone else's story."],
    related: ["what-to-say-instead-of-get-well-soon", "get-well-soon-messages-for-serious-illness", "short-get-well-soon-messages"]
  },
  {
    slug: "get-well-soon-messages-for-flu",
    title: "Get Well Soon Messages for Flu",
    eyebrow: "Flu recovery",
    description: "Get well soon messages for the flu that are light, comforting, and easy to send on rough sick days.",
    summary: "Short, light messages for flu, fever, and rough sick days.",
    intro: "Flu messages can be simple and lighter than serious illness notes. Wish them rest, low-effort comfort, and an easier day without asking for energy back.",
    nav: "For flu",
    sections: [
      {
        id: "quick",
        title: "Quick flu messages",
        messages: [
          "Feel better soon. Hope today gives you a little more rest and a little less misery.",
          "Sending soup thoughts, cozy blanket energy, and zero obligations.",
          "Hope today brings more rest and less flu misery.",
          "Rest up and take the day one small comfort at a time."
        ]
      },
      {
        id: "funny",
        title: "Funny flu messages",
        messages: [
          "Get well soon. Your germs have had enough attention.",
          "The flu does not deserve this much screen time. Please give it terrible reviews.",
          "Sending virtual soup because real soup requires logistics."
        ]
      },
      {
        id: "work",
        title: "For a coworker with the flu",
        messages: [
          "Wishing you a low-pressure sick day and plenty of rest. Please take the time you need.",
          "Hope you feel better soon. The team is thinking of you.",
          "Get some rest and do not worry about work right now."
        ]
      }
    ],
    faqs: [
      {
        question: "What is a good flu message that is light but not dismissive?",
        answer: "Try: \"Feel better soon. Hope today gives you a little more rest and a little less misery.\" It is casual without pretending the flu is nothing."
      },
      {
        question: "What can I text a coworker with the flu?",
        answer: "Keep it professional and remove work pressure: \"Wishing you a low-pressure sick day and plenty of rest. Please take the time you need.\""
      },
      {
        question: "Can I joke in a flu message?",
        answer: "Yes, if the person usually likes humor and the illness is routine. Keep the joke about the flu, soup, blankets, or boredom rather than their body or symptoms."
      },
      {
        question: "What should I avoid saying to someone with the flu?",
        answer: "Do not ask them to work sick, minimize how bad it feels, or expect a detailed reply. A short, low-effort message is usually best."
      }
    ],
    dos: ["Keep it light.", "Encourage rest.", "Offer food or errands if you are close."],
    donts: ["Do not ask them to work while sick.", "Do not minimize how awful flu can feel.", "Do not expect a long reply."],
    related: ["funny-get-well-soon-messages", "short-get-well-soon-messages", "get-well-soon-text-messages"]
  },
  {
    slug: "get-well-soon-messages-for-broken-bone",
    title: "Get Well Soon Messages for Broken Bone",
    eyebrow: "Broken bone",
    description: "Get well soon messages for a broken bone that balance patience, practical help, and light humor.",
    summary: "Messages for casts, crutches, and slow physical healing.",
    intro: "A broken bone is painful and annoying. A good message can acknowledge the inconvenience, add a little humor if appropriate, and offer practical help.",
    nav: "Broken bone",
    sections: [
      {
        id: "quick",
        title: "Quick broken bone messages",
        messages: [
          "Wishing you steady healing and fewer annoying cast moments.",
          "Hope the pain eases and recovery feels a little less slow each day.",
          "Rest up and let that bone do its repair work.",
          "Sending patience, comfort, and support for the slow parts."
        ]
      },
      {
        id: "funny",
        title: "Funny broken bone messages",
        messages: [
          "Get well soon. Your bone clearly misunderstood the assignment.",
          "Hope your cast gets excellent signatures and your days feel easier.",
          "Rest up. I will save the dramatic comeback music for your return."
        ]
      },
      {
        id: "help",
        title: "Messages with practical help",
        messages: [
          "If crutches are making life annoying, I can help with groceries or errands this week.",
          "I can drive, carry things, or bring food while you recover. Just say the word.",
          "I am around if you need help with anything awkward while moving around is harder."
        ]
      }
    ],
    decisionGuide: {
      title: "Choose the right broken bone message",
      intro: "A broken bone message can be lighter than a serious illness note, but it should still respect pain, frustration, and limited mobility.",
      items: [
        {
          label: "Simple check-in",
          useWhen: "You want a quick text that does not ask for the accident story.",
          try: "Thinking of you and hoping today feels a little more comfortable."
        },
        {
          label: "Practical help",
          useWhen: "Crutches, a cast, or limited movement may make errands harder.",
          try: "I can help with groceries, a ride, or carrying things this week if that would make the day easier."
        },
        {
          label: "Light humor",
          useWhen: "They are already joking about the cast or crutches.",
          try: "Hope your cast gets excellent signatures and your days feel a little easier."
        },
        {
          label: "Longer recovery",
          useWhen: "Healing is slower than expected and they may be frustrated.",
          try: "I know this is taking patience. Sending comfort and support for the slow parts too."
        }
      ]
    },
    faqs: [
      {
        question: "What do you write to someone with a broken bone?",
        answer: "Keep it practical and encouraging. Mention patience, comfort, and help with everyday tasks while moving around is harder."
      },
      {
        question: "Can I joke about a broken bone?",
        answer: "Light humor can work if the person is already joking about it. Avoid jokes about pain, the accident, or blame."
      },
      {
        question: "What practical help can I offer?",
        answer: "Offer errands, rides, carrying things, meals, or help with tasks that are difficult with a cast or crutches."
      }
    ],
    dos: ["Acknowledge the frustration.", "Offer help with mobility or errands.", "Use humor if the person likes it."],
    donts: ["Do not ask them to retell the accident.", "Do not say at least it was not worse.", "Do not push them to hurry back."],
    related: ["get-well-soon-messages-for-injury", "funny-get-well-soon-messages", "get-well-soon-text-messages"]
  },
  {
    slug: "get-well-soon-messages-for-flowers",
    title: "Get Well Soon Messages for Flowers",
    eyebrow: "Flower notes",
    description: "Short get well soon messages for flowers, bouquets, plant gifts, and hospital delivery cards.",
    summary: "Short notes for bouquets, plants, and gift deliveries.",
    intro: "Flower cards are small, so the message should be short. Aim for warmth, brightness, and no pressure to reply.",
    nav: "For flowers",
    sections: [
      {
        id: "quick",
        title: "Quick flower card messages",
        messages: [
          "A little brightness for your room and a lot of love for your day.",
          "Sending these with warm thoughts and hopes for gentle healing.",
          "May these flowers bring a small smile and a reminder that you are loved.",
          "Thinking of you and wishing you comfort, rest, and care."
        ]
      },
      {
        id: "hospital",
        title: "Hospital flower notes",
        messages: [
          "Sending a little color to your room and steady support to your day.",
          "Hope these bring a bit of brightness while you rest and recover.",
          "No need to reply. Just sending love, flowers, and warm thoughts."
        ]
      },
      {
        id: "serious",
        title: "Serious illness flower notes",
        messages: [
          "Thinking of you and sending quiet support through this difficult time.",
          "May these bring a little comfort today. You are not alone.",
          "Sending care, love, and a small bit of brightness."
        ]
      }
    ],
    decisionGuide: {
      title: "Choose the right flower note",
      intro: "Flower cards are small, so choose one sentence that fits the situation. The note should support the gift, not explain everything.",
      items: [
        {
          label: "Bright and simple",
          useWhen: "The illness is routine or you want a warm everyday note.",
          try: "A little brightness for your room and a lot of care for your day."
        },
        {
          label: "Hospital delivery",
          useWhen: "The flowers are going to a hospital or recovery room.",
          try: "Sending a little color to your room and steady support to your day."
        },
        {
          label: "Serious illness",
          useWhen: "Cheerful recovery language may feel too strong.",
          try: "Thinking of you and sending quiet support through this difficult time."
        },
        {
          label: "From a group",
          useWhen: "Several people are sending one bouquet or plant.",
          try: "All of us are thinking of you and sending warm wishes for comfort and care."
        }
      ]
    },
    faqs: [
      {
        question: "What should I write on get well flowers?",
        answer: "Keep it short: A little brightness for your room and a lot of love for your day."
      },
      {
        question: "How long should a flower card message be?",
        answer: "One or two sentences is enough because the card is small. Choose warmth over detail."
      },
      {
        question: "What should I write on flowers for serious illness?",
        answer: "Use quiet support rather than cheerful pressure: Thinking of you and sending comfort through this difficult time."
      }
    ],
    dos: ["Keep it short.", "Match the note to the seriousness of the illness.", "Use no need to reply when appropriate."],
    donts: ["Do not write a long paragraph on a tiny card.", "Do not use jokes for serious illness.", "Do not promise a timeline."],
    related: ["get-well-soon-card-messages", "get-well-soon-messages-for-hospital-stay", "short-get-well-soon-messages"]
  },
  {
    slug: "get-well-soon-messages-for-wife",
    title: "Get Well Soon Messages for Your Wife",
    eyebrow: "For wife",
    description: "Loving get well messages for your wife, with short texts, a heartfelt card, and practical words for hospital stays, recovery at home, or time apart.",
    summary: "Affectionate notes, thoughtful offers of help, and room for hard days.",
    intro: "Send your wife a loving text, a complete card, or a specific offer of help. Find words for hospital stays, time apart, and harder days during recovery. Let her choose company, distraction, or quiet.",
    nav: "For wife",
    sections: [
      {
        id: "quick",
        title: "Short get well texts for your wife",
        messages: [
          "I love you. I hope there is something gentle and comforting in your day today.",
          "No need to reply. I am thinking of you and sending all my love.",
          "I wish I could make this easier. Would you like company, a distraction, or some quiet?",
          "Feel better, love. You do not need to put on a brave face for me."
        ],
        nav: "Short texts"
      },
      {
        id: "heartfelt",
        title: "Heartfelt messages and a complete card",
        messages: [
          "You do not have to be strong every second. I love you on the hard days too.",
          "Let yourself be cared for. I am here for the quiet days, the frustrating days, and everything in between.",
          "My love,\n\nI wish I could take away what you are going through. I cannot, but I can listen and be beside you in the ways that help. You are loved just as much when you are tired, frustrated, or not feeling like yourself.\n\nAll my love,\n[Your name]"
        ],
        nav: "Heartfelt cards"
      },
      {
        id: "surgery",
        title: "In hospital and after surgery",
        intro: "Focus on comfort and her preferences. Offer only visits or tasks you can manage, and follow the visiting arrangements she and the hospital have agreed.",
        messages: [
          "I am grateful the surgery is behind you. I love you, and I want to make this time easier in whatever small ways I can.",
          "Recovery may take patience, but you do not have to do it alone. I love you.",
          "If you want a visit this afternoon, I can bring your headphones and the book by your bed. We can just sit together; you do not have to make conversation.",
          "Love, if answering messages feels like too much, I can send an update to the people you choose. I will only share what you want me to."
        ],
        nav: "Hospital & surgery"
      },
      {
        id: "help-at-home",
        title: "Offering specific help at home",
        intro: "Adapt these offers to your household and availability. Be specific enough that she does not have to plan or delegate a whole list of jobs.",
        messages: [
          "I can take care of school pickup and dinner today. If there is something you would especially like to eat, tell me whenever you feel up to it.",
          "I can handle the laundry this weekend. You do not need to sort it first or keep me company while I do it.",
          "If you would prefer no visitors today, I can let the family know. I will check with you before arranging another time.",
          "Would it help if I stayed with you for a while, or would you rather have the room to yourself? Either is okay, love."
        ],
        nav: "Help at home"
      },
      {
        id: "far-away",
        title: "When you cannot be there in person",
        intro: "Make an offer that works from where you are. A missed call or an unanswered text does not need a follow-up asking her to explain.",
        messages: [
          "I wish I could be beside you tonight. I have sent a little voice note for whenever you want to hear a familiar voice. No need to answer.",
          "I can arrange a grocery delivery from here if that would help. We can keep it to the things you already know you want.",
          "If you feel like company later, we could put the same film on and stay on the phone for a while. If you would rather sleep, I am sending a kiss for when you wake up."
        ],
        nav: "When apart"
      },
      {
        id: "harder-days",
        title: "When recovery feels uneven",
        intro: "A harder day does not need a pep talk. Acknowledge how she feels without interpreting symptoms or measuring her progress for her.",
        messages: [
          "I am sorry today feels harder. You do not have to find a positive side for my sake. I love you, and I am listening.",
          "We do not have to make today match yesterday. Would you like to talk about it, or would a little distraction feel better?",
          "You are more than how this recovery is going. I want to hear about whatever is on your mind, even if it has nothing to do with being unwell."
        ],
        nav: "Harder days"
      }
    ],
    faqs: [
      {
        question: "What should I write to my wife when she is sick?",
        answer: "Say you love her in your usual words, then offer one kind of support you can provide. A short message can be enough: I love you. Would you like company or some quiet? Avoid turning the note into a list of instructions."
      },
      {
        question: "How can I support my wife after surgery in a message?",
        answer: "Ask what would make the day more comfortable and offer a specific task, such as bringing a familiar item or handling a meal. Let her choose how much company she wants. Leave medical instructions to her care team, and do not share health updates without her agreement."
      },
      {
        question: "What can I say if my wife is having a harder day during recovery?",
        answer: "Acknowledge the day without telling her she should be more positive. Try I am sorry today feels harder. Would you like me to listen, or would a distraction help? Avoid comparing her progress with yesterday or with someone else."
      },
      {
        question: "How do I offer help without making my wife organize everything?",
        answer: "Name one task and a time you can manage instead of asking for a full list. For example, offer to handle dinner tonight or the laundry this weekend. Check her preferences where needed, and do not promise arrangements that depend on someone else agreeing."
      },
      {
        question: "What should I avoid in a get well message for my wife?",
        answer: "Avoid making her reassure you, treating care like a favor, or calling her dramatic when she is tired, scared, or in pain. Do not promise a recovery date or imply that her usual responsibilities are waiting for her."
      }
    ],
    dos: [
      "Say love plainly.",
      "Offer specific help you can provide.",
      "Respect her choice of company or quiet."
    ],
    donts: [
      "Do not make her reassure you.",
      "Do not compare good days and bad days.",
      "Do not treat care as a favor."
    ],
    related: [
      "get-well-soon-messages-for-girlfriend",
      "get-well-soon-messages-after-surgery",
      "what-to-say-instead-of-get-well-soon"
    ],
    seoTitle: "Get Well Soon Messages for Your Wife: Texts & Cards",
    dateModified: "2026-09-22",
    personalizationSteps: [
      "Use your usual name for her and a level of affection that feels natural in your relationship.",
      "Choose one real task you can take on, such as a meal or school pickup, and be clear about when you are available.",
      "Let her choose company, distraction, or quiet. Remove any request for reassurance or a reply if she is tired."
    ]
  },
  {
    slug: "get-well-soon-messages-for-husband",
    title: "Get Well Soon Messages for Your Husband",
    eyebrow: "For husband",
    description: "Find get well messages for your husband: loving texts, a complete card, gentle humor, and practical support during hospital stays or a longer recovery.",
    summary: "Loving texts, gentle humor, and support through hospital stays and recovery.",
    intro: "Find a loving text, a complete card, or a little everyday conversation for your husband. There are messages for hospital stays, time apart, and a longer recovery. Choose help you can offer and humor he would welcome.",
    nav: "For husband",
    sections: [
      {
        id: "quick",
        title: "Short get well texts for your husband",
        messages: [
          "I love you. I hope you feel cared for while you rest.",
          "No need to reply. I am thinking of you and hoping today feels easier.",
          "Feel better soon, love. You do not need to put anyone else first right now.",
          "Sending a kiss and a little reminder that you are loved, even when the day is difficult."
        ],
        nav: "Short texts"
      },
      {
        id: "heartfelt",
        title: "Heartfelt messages and a complete card",
        messages: [
          "You do not have to be strong every minute. I love you exactly where you are today.",
          "Recovery can be frustrating, but you are not doing it alone. I am with you.",
          "My love,\n\nI wish I could take the hard part away. Since I cannot, I want you to know you do not have to hide it from me. I love you, and I am here to listen, share a quiet moment, or help with the next small thing.\n\nWith all my love,\n[Your name]"
        ],
        nav: "Heartfelt cards"
      },
      {
        id: "hospital-surgery",
        title: "In hospital or after surgery",
        intro: "A hospital message can be brief and familiar. Only offer visits you can make, check visiting arrangements, and avoid predicting how an operation or recovery will go.",
        messages: [
          "Thinking of you before your surgery, love. If talking would help, I am free for a call this morning; if you need quiet, there is no need to answer.",
          "I can bring your charger and clean clothes when visiting is possible. Let me know if you would like anything else familiar from home.",
          "I am glad I can send you this little note after surgery. I love you. There is no need to give me a full update; we can talk whenever you feel like it."
        ],
        nav: "Hospital & surgery"
      },
      {
        id: "practical-help",
        title: "Loving messages with practical help",
        intro: "Choose an offer that is true for your household. Taking on one clear task can be more useful than promising to handle everything.",
        messages: [
          "I can sort dinner tonight and take the dog out. Would a bit of quiet afterward feel good, or would you like some company?",
          "If people keep asking for news, I can reply to the messages you choose. You can tell me what you are comfortable sharing.",
          "I can pick up the shopping on my way home. Send a short list if there is anything you want; otherwise I can get our usual things."
        ],
        nav: "Practical help"
      },
      {
        id: "far-away",
        title: "When you are apart",
        intro: "Send something he can enjoy without needing to respond. If you offer a call, give a time you can actually be available.",
        messages: [
          "I wish I were there to hold your hand. For now, I am sending all my love in this message, with no reply needed.",
          "I saw something today that would have made you laugh. I have sent the photo for whenever you want a little distraction. Missing you, love.",
          "I am free to talk after dinner if you want a familiar voice. We can talk about the match, the dog, or absolutely nothing important."
        ],
        nav: "When apart"
      },
      {
        id: "longer-recovery",
        title: "Through a longer or uneven recovery",
        intro: "Leave room for boredom, frustration, and difficult days. A message can offer companionship without asking him to prove he is improving.",
        messages: [
          "I hear how frustrating this is. You do not need to turn it into a cheerful story for me. I am here to listen.",
          "A difficult day does not change how I feel about you. I love you, and we can keep today as simple as it needs to be.",
          "If you are tired of talking about recovery, I would love to hear what else is on your mind. You get to choose the subject."
        ],
        nav: "Longer recovery"
      },
      {
        id: "funny",
        title: "Light funny messages",
        intro: "Use these only for a minor illness when he wants a joke. Skip humor if he is scared or in pain, and never make symptoms, weakness, or needing care the punchline.",
        messages: [
          "I love you. I am prepared to watch your favorite film again, which is a very serious declaration.",
          "If you want company, I can bring tea and my exceptionally average conversation.",
          "Sending a kiss and a solemn promise not to reveal the ending of our show."
        ],
        nav: "Gentle humor"
      }
    ],
    faqs: [
      {
        question: "What should I text my husband when he is sick?",
        answer: "A loving sentence and a small, realistic offer are enough. Try I love you. I can sort dinner tonight if that would help. If he is tired or in hospital, add that no reply is needed rather than asking for a detailed update."
      },
      {
        question: "Can I send a funny get well message to my husband?",
        answer: "Yes, when the illness is minor and he welcomes that tone. Make the joke about something ordinary you share, such as a favorite film. Avoid joking about pain, fear, or being a difficult patient, and choose a straightforward loving message on a hard day."
      },
      {
        question: "What can I say to my husband before or after surgery?",
        answer: "Keep it familiar and calm: say you love him, explain when you can be available, or offer to bring something from home. Avoid promising that everything will go well or setting a timeline for recovery. Follow his preferences about calls and visits."
      },
      {
        question: "How do I support my husband when recovery is taking a long time?",
        answer: "Make room for frustration without asking him to stay strong or positive. Offer conversation about everyday interests as well as the illness. Ask whether he wants listening, distraction, or practical help, and keep offers within what you can do."
      },
      {
        question: "How can I make a message useful as well as loving?",
        answer: "Name one task and a time, such as shopping on your way home or dinner tonight. If you offer to update relatives or coordinate visits, ask what he wants shared and who should be contacted first. Do not promise that other people will change their plans."
      }
    ],
    dos: [
      "Offer one concrete form of support.",
      "Let him be honest about difficult days.",
      "Use humor only if he welcomes it."
    ],
    donts: [
      "Do not pressure him to be tough.",
      "Do not promise a recovery timeline.",
      "Do not make pain or needing care the joke."
    ],
    related: [
      "get-well-soon-messages-for-boyfriend",
      "funny-get-well-soon-messages",
      "get-well-soon-messages-after-surgery"
    ],
    seoTitle: "Get Well Soon Messages for Your Husband",
    dateModified: "2026-09-22",
    personalizationSteps: [
      "Use the nickname or greeting you normally use with him so the message sounds like your own voice.",
      "Name one thing you can do today, or mention an ordinary interest you share if he would welcome a distraction.",
      "Match the tone to how he is feeling now. Skip teasing on a painful or frightening day, even if you usually joke together."
    ]
  },
  {
    slug: "how-to-respond-to-get-well-soon",
    title: "How to Respond to Get Well Soon",
    seoTitle: "How to Respond to Get Well Soon: Simple Thank-You Replies",
    datePublished: "2026-09-22",
    dateModified: "2026-09-22",
    eyebrow: "Replying to well wishes",
    description: "Reply to get well soon wishes with a simple thank-you. Find texts for friends, replies to a boss or team, and wording when you are still unwell.",
    summary: "Thank someone who has wished you well, with or without a health update.",
    intro: "A simple thank-you is enough when someone says get well soon. You can acknowledge their kindness without explaining your symptoms or promising when you will be better. Start with a short reply below, then add an update only if you want to share one. These examples are for the person receiving the well wishes.",
    nav: "Reply to well wishes",
    sections: [
      {
        id: "quick",
        title: "Short replies to get well soon",
        nav: "Short replies",
        intro: "These work in a text, chat, or spoken conversation. A longer reply is optional; you do not need a different phrase every time someone wishes you well.",
        messages: [
          "Thank you for thinking of me.",
          "Thanks, that's really kind of you.",
          "I appreciate your good wishes."
        ]
      },
      {
        id: "friends",
        title: "Warm replies to friends and family",
        nav: "Friends and family",
        intro: "Use your usual voice. You can mention that their message was welcome without giving a detailed update or reassuring them that everything is fine.",
        messages: [
          "Thanks for checking in. It was lovely to hear from you.",
          "Thank you. I'm glad to have you in my corner."
        ]
      },
      {
        id: "work",
        title: "Replying to a boss or coworker",
        nav: "Boss or coworker",
        intro: "For an existing email thread, a brief thank-you can be the whole reply. Add your usual greeting and sign-off if that fits the conversation. If the email also asks a work question, handle any necessary arrangements separately from thanking them for their wishes.",
        messages: [
          "Thank you for your kind wishes. I appreciate you checking in.",
          "Thank you for thinking of me. I'm still resting and appreciate your message."
        ],
        links: [
          { slug: "get-well-soon-messages-for-boss", label: "Your boss is the one who is unwell? Find messages to send them." },
          { slug: "get-well-soon-messages-for-coworker", label: "A coworker told you they are ill? Find a reply wishing them well." }
        ]
      },
      {
        id: "group",
        title: "Thanking a group for a card or messages",
        nav: "Group thanks",
        intro: "One message can acknowledge the whole group. Mention a card, flowers, or another gift only if you actually received it; otherwise thank them for their messages.",
        messages: [
          "Thank you all for your kind messages. I appreciate you thinking of me.",
          "Thank you for the card and all your lovely notes. It meant a lot to hear from everyone."
        ]
      },
      {
        id: "health-update",
        title: "With or without an update on how you feel",
        nav: "Optional update",
        intro: "Choose the version that is true today. Being grateful does not require saying you feel better. You can also keep the reply to a thank-you and leave out health details entirely.",
        messages: [
          "Thank you for asking. I'm still feeling unwell, but I appreciate you checking in.",
          "Thanks for thinking of me. I'm feeling a little better today.",
          "Thank you for your kind message. I'd rather keep the details private, but I appreciate your concern."
        ]
      },
      {
        id: "later",
        title: "If you are replying later or need some quiet",
        nav: "Replying later",
        intro: "If you want to acknowledge a delay, a short explanation is enough. You can thank someone now and leave the conversation there until you feel like talking.",
        messages: [
          "I've only just had the energy to reply, but I wanted to thank you for your message.",
          "Thank you for checking in. I'm keeping messages brief while I rest, but I appreciate hearing from you."
        ]
      }
    ],
    personalizationSteps: [
      "Thank them for what they actually sent: a message, a card, a gift, or an offer of help.",
      "Decide whether you want to share an update. Keep it accurate and as brief as you like; a thank-you can stand on its own.",
      "Match your normal relationship. A friendly text can be casual; a work reply can stay short and courteous."
    ],
    faqs: [
      {
        question: "Is thank you enough when someone says get well soon?",
        answer: "Yes. Thank you, or Thanks for thinking of me, acknowledges their kindness. You do not need to explain your condition or find a more elaborate response."
      },
      {
        question: "How do I reply to get well soon from my boss?",
        answer: "Try: Thank you for your kind wishes. I appreciate you checking in. If you also need to discuss work arrangements, address those separately and use only information you can confirm. A thank-you does not need to include a return date."
      },
      {
        question: "What can I say if I am not getting better yet?",
        answer: "You can simply thank them, or say: I'm still feeling unwell, but I appreciate you checking in. You can acknowledge the care behind the message without saying that recovery is going well."
      },
      {
        question: "Do I have to reply to every get well message individually?",
        answer: "If you do not have the energy for individual replies, you can wait or send a shared thank-you to a group that contacted you together. Keep private messages private; there is no need to copy everyone's details into a group response."
      }
    ],
    dos: ["Keep the thank-you as short as you need.", "Share only the update you want to give.", "Mention a specific gift or help only when it was actually offered or received."],
    donts: ["Do not feel you have to report that you are improving.", "Do not promise a recovery or return-to-work date just to be reassuring.", "Do not include health details you would rather keep private."],
    related: ["get-well-soon-messages", "get-well-soon-text-messages", "get-well-soon-messages-for-boss", "get-well-soon-messages-for-coworker"]
  }
];

module.exports = { pages };
