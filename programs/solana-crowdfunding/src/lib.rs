use anchor_lang::prelude::*;
use anchor_lang::solana_program;

declare_id!("9mpE1jK1k2V2X9KZW269pPE34j39wNwX3aQHejeHgKuQ");

#[program]
pub mod solana_crowdfunding {
    use super::*;

    pub fn create(ctx: Context<Create>, goal: u64, deadline: u64, name: String) -> Result<()> {
        let project = &mut ctx.accounts.project;

        require!(goal > 0, ProjectErrors::GoalIsZero);
        require!(
            deadline > Clock::get()?.unix_timestamp.try_into().unwrap(),
            ProjectErrors::DeadlineInThePast
        );

        project.name = name;
        project.auth = ctx.accounts.user.key();
        project.goal = goal;
        project.donated_amount = 0;
        project.deadline = deadline;

        Ok(())
    }

    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        require!(amount != 0, ProjectErrors::DonationIsZero);

        let project = &mut ctx.accounts.project;

        let ix = solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &project.key(),
            amount,
        );

        let _ = solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                project.to_account_info(),
            ],
        );

        project.donated_amount += amount;
        if project.donators.len() == 9 {
            project.donators.pop();
            project.donations.pop();
            project.donators.push(ctx.accounts.user.key());
            project.donations.push(amount);
        }

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        let project = &mut ctx.accounts.project;
        let user = &mut ctx.accounts.user;

        require!(
            project.auth.key() == user.key(),
            ProjectErrors::UserNotOwner
        );

        require!(
            project.goal <= project.donated_amount,
            ProjectErrors::GoalNotReached
        );

        require!(
            project.deadline <= (Clock::get()?.unix_timestamp * 1000).try_into().unwrap(),
            ProjectErrors::DeadlineNotOver
        );

        let amount = project.to_account_info().lamports();

        **user.to_account_info().try_borrow_mut_lamports()? += amount;
        **project.to_account_info().try_borrow_mut_lamports()? = 0;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, seeds=[b"seed", user.key().as_ref()], bump, payer=user, space=Project::MAX_SIZE)]
    pub project: Account<'info, Project>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub project: Account<'info, Project>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub project: Account<'info, Project>,

    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct Project {
    pub name: String,

    pub goal: u64,

    pub donated_amount: u64,

    pub donators: Vec<Pubkey>,

    pub donations: Vec<u64>,

    pub deadline: u64,

    pub auth: Pubkey,
}

impl Project {
    pub const MAX_SIZE: usize = 8 + 8 + 8 + 8 + (10 * 32) + (10 * 8) + 32;
}

#[error_code]
pub enum ProjectErrors {
    #[msg("Name should be of 15 characters or less.")]
    NameTooLong,

    #[msg("Story should be of 15 characters or less.")]
    StoryTooLong,

    #[msg("Deadline for this should be in future.")]
    DeadlineInThePast,

    #[msg("Goal amount should be greater than zero.")]
    GoalIsZero,

    #[msg("Donation amount should be greater than zero.")]
    DonationIsZero,

    #[msg("Goal for this project has not been reached yet.")]
    GoalNotReached,

    #[msg("Deadline for this project is not over yet.")]
    DeadlineNotOver,

    #[msg("You are not the owner of this project.")]
    UserNotOwner,
}
