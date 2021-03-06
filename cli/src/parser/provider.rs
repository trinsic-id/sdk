use crate::error::Error;
use clap::ArgMatches;
use std::fmt::{self, Display, Formatter};

pub(crate) fn parse<'a>(args: &'a ArgMatches<'_>) -> Result<Command<'a>, Error> {
    if args.is_present("create-ecosystem") {
        create_ecosystem(&args.subcommand_matches("create-ecosystem").expect("Error parsing request"))
    } else if args.is_present("update-ecosystem") {
        update_ecosystem(&args.subcommand_matches("update-ecosystem").expect("Error parsing request"))
    } else if args.is_present("ecosystem-info") {
        ecosystem_info()
    } else if args.is_present("invite") {
        invite(&args.subcommand_matches("invite").expect("Error parsing request"))
    } else if args.is_present("add-webhook") {
        add_webhook(&args.subcommand_matches("add-webhook").expect("Error parsing request"))
    } else if args.is_present("delete-webhook") {
        delete_webhook(&args.subcommand_matches("delete-webhook").expect("Error parsing request"))
    } else {
        Err(Error::MissingArguments)
    }
}

fn create_ecosystem<'a>(args: &'a ArgMatches<'_>) -> Result<Command<'a>, Error> {
    let ecosystem = CreateEcosystemArgs {
        name: args.value_of("name").map(|x| x.into()),
        email: args.value_of("email").map(|x| x.into()),
        alias: args.value_of("alias").map_or("default".to_string(), |x| x.into()),
    };

    Ok(Command::CreateEcosystem(ecosystem))
}

fn update_ecosystem<'a>(args: &'a ArgMatches<'_>) -> Result<Command<'a>, Error> {
    if !args.is_present("description") && !args.is_present("uri") {
        return Err(Error::MissingArguments);
    }

    let args = UpdateEcosystemArgs {
        description: args.value_of("description").map(|x| x.into()),
        uri: args.value_of("uri").map(|x| x.into()),
    };

    Ok(Command::UpdateEcosystem(args))
}

fn ecosystem_info<'a>() -> Result<Command<'a>, Error> {
    Ok(Command::EcosystemInfo)
}

fn add_webhook<'a>(args: &'a ArgMatches<'_>) -> Result<Command<'a>, Error> {
    // Get the events arg
    let events_val: &'a str = args.value_of("events").unwrap_or("*");

    // Split on comma
    let split = events_val.split(",");

    // Fill a Vec<String> with the split contents
    let mut events = vec![];
    events.extend(split.into_iter().map(|x| x.into()));

    Ok(Command::AddWebhook(AddWebhookArgs {
        url: args.value_of("url").map(|x| x.into()).unwrap(),
        secret: args.value_of("secret").map(|x| x.into()).unwrap(),
        events,
    }))
}

fn delete_webhook<'a>(args: &'a ArgMatches<'_>) -> Result<Command<'a>, Error> {
    Ok(Command::DeleteWebhook(DeleteWebhookArgs {
        webhook_id: args.value_of("webhook-id").map(|x| x.into()).unwrap(),
    }))
}

fn invite<'a>(args: &'a ArgMatches<'_>) -> Result<Command<'a>, Error> {
    Ok(Command::Invite(InviteArgs {
        participant_type: if args.is_present("organization") {
            ParticipantType::Organization
        } else {
            ParticipantType::Individual
        },
        invitation_method: if args.is_present("method-email") {
            InvitationMethod::Email(args.value_of("method-email").expect("Unable to parse").to_string())
        } else if args.is_present("method-email") {
            InvitationMethod::Sms(args.value_of("method-sms").expect("Unable to parse").to_string())
        } else {
            InvitationMethod::None
        },
        description: args.value_of("description"),
    }))
}

#[derive(Debug, PartialEq)]
pub enum Command<'a> {
    CreateEcosystem(CreateEcosystemArgs),
    UpdateEcosystem(UpdateEcosystemArgs),
    EcosystemInfo,
    AddWebhook(AddWebhookArgs),
    DeleteWebhook(DeleteWebhookArgs),
    Invite(InviteArgs<'a>),
    InvitationStatus,
}

#[derive(Debug, PartialEq)]
pub struct CreateEcosystemArgs {
    pub name: Option<String>,
    pub email: Option<String>,
    pub alias: String,
}

#[derive(Debug, PartialEq)]
pub struct UpdateEcosystemArgs {
    pub description: Option<String>,
    pub uri: Option<String>,
}

#[derive(Debug, PartialEq)]
pub struct AddWebhookArgs {
    pub url: String,
    pub secret: String,
    pub events: Vec<String>,
}

#[derive(Debug, PartialEq)]
pub struct DeleteWebhookArgs {
    pub webhook_id: String,
}

#[derive(Debug, PartialEq)]
pub struct InviteArgs<'a> {
    pub participant_type: ParticipantType,
    pub invitation_method: InvitationMethod,
    pub description: Option<&'a str>,
}

#[derive(Debug, PartialEq)]
pub enum ParticipantType {
    Individual,
    Organization,
}

#[derive(Debug, PartialEq)]
pub enum InvitationMethod {
    Email(String),
    Sms(String),
    None,
}

#[derive(Debug, PartialEq)]
pub struct Member {
    pub name: String,
    pub email: String,
}

impl Display for Member {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        write!(f, "name: {}\nemail: {}", self.name, self.email)
    }
}
