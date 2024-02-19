import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { NagSuppressions } from 'cdk-nag';

export class CdkDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Suppress AwsSolutions-S1 rule
    NagSuppressions.addStackSuppressions(this, [
      {
        id: 'AwsSolutions-S1',
        reason: 'this is a demo stack',
      }
    ])

    // Define an S3 bucket
    new s3.Bucket(this, 'MyDemoBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
      enforceSSL: true
    });
  }
}
