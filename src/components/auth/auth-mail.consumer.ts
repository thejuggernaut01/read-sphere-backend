import {
  OnQueueEvent,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { QUEUE_NAME } from '../../common/constants/queue.constant';
import { MailService } from '../mail/mail.service';
import { Job } from 'bullmq';
import { IEmailJobData } from './types';
import { AUTH_JOB_NAMES } from './enum';

@Processor(QUEUE_NAME.AUTH)
export class AuthMailConsumer extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  @OnQueueEvent('added')
  onQueueAdded(job: Job) {
    console.log(
      `[QUEUE EVENT - ADDED] A new job has been added to the queue. Job ID: ${job.id}, Name: ${job.name}, Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueEvent('failed')
  onQueueFailed(job: Job) {
    console.log(
      `[QUEUE EVENT - FAILED] Job processing failed. 
    Job ID: ${job.id}, 
    Name: ${job.name}, 
    Attempts Made: ${job.attemptsMade}/${job.opts.attempts}, 
    Reason: ${job.failedReason}`,
    );
  }

  @OnQueueEvent('waiting')
  onQueueWaiting(job: Job) {
    console.log(
      `[QUEUE EVENT - WAITING] Job is now waiting to be processed. 
    Job ID: ${job.id}, Name: ${job.name}`,
    );
  }

  @OnQueueEvent('completed')
  onQueueCompleted(job: Job) {
    console.log(
      `[QUEUE EVENT - COMPLETED] Job successfully completed. 
    Job ID: ${job.id}, 
    Name: ${job.name}, 
    Return Value: ${JSON.stringify(job.returnvalue)}`,
    );
  }

  @OnWorkerEvent('error')
  onWorkerError(job: Job) {
    console.error(
      `[WORKER EVENT - ERROR] An error occurred during job processing. 
    Job ID: ${job.id}, 
    Name: ${job.name}, 
    Error: ${job.failedReason || 'Unknown error'}`,
    );
  }

  async process(job: Job<IEmailJobData, any, string>): Promise<any> {
    try {
      const { name, data } = job;
      const {
        subject,
        code,
        user: { email, firstName, lastName },
      } = data;

      switch (name) {
        case AUTH_JOB_NAMES.SEND_VERIFICATION_EMAIL: {
          await this.mailService.sendVerificationEmail(subject, code, {
            email,
            firstName,
            lastName,
          });

          console.log(`Verification email sent to ${email}`);
          break;
        }

        case AUTH_JOB_NAMES.SEND_WELCOME_EMAIL: {
          await this.mailService.sendWelcomeEmail(subject, {
            email,
            firstName,
            lastName,
          });

          console.log(`Welcome email sent to ${email}`);
          break;
        }

        case AUTH_JOB_NAMES.SEND_FORGOT_PASSWORD_EMAIL: {
          await this.mailService.sendForgotPasswordEmail(subject, code, {
            email,
            firstName,
            lastName,
          });

          console.log(`Forgot password verification email sent to ${email}`);
          break;
        }

        default:
          console.warn(`No processor for job: ${name}`);
          break;
      }
    } catch (error) {
      console.error(`Failed to process job ${job.name}`, error);
    }
  }
}
