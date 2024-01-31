#!/usr/bin/env node
import 'source-map-support/register';
import { App, Aspects } from 'aws-cdk-lib';
import { CdkDemoStack } from '../lib/stacks/cdk-demo-stack';
import { StepBatchStack } from '../lib/stacks/step-batch-stack';
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag';

const app = new App();
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
new CdkDemoStack(app, 'CdkDemoStack');

const stepBatchStack = new StepBatchStack(app, 'StepBatchStack');

NagSuppressions.addStackSuppressions(stepBatchStack, [
  {
    id: "AwsSolutions-S1",
    reason: "overkill for this small sample",
  },
  {
    id: "AwsSolutions-IAM4",
    reason: "Managed policies are sufficient for a sample of this size",
  },
  {
    id: "AwsSolutions-IAM5",
    reason: "Some dynamic wildcard permissions are required for several service actions",
  },
]);

app.synth();
