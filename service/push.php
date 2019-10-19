<?php

use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

function push($notifications) {

    // array of notifications

    $webPush = new WebPush();

    // send multiple notifications with payload
    foreach ($notifications as $notification) {
        $webPush->sendNotification(
            $notification['subscription'],
            $notification['payload'] // optional (defaults null)
        );
    }

    /**
     * Check sent results
     * @var MessageSentReport $report
     */
    foreach ($webPush->flush() as $report) {
        $endpoint = $report->getRequest()->getUri()->__toString();

        if ($report->isSuccess()) {
            echo "[v] Message sent successfully for subscription {$endpoint}.";
        } else {
            echo "[x] Message failed to sent for subscription {$endpoint}: {$report->getReason()}";
        }
    }

    /**
     * send one notification and flush directly
     * @var \Generator<MessageSentReport> $sent
     */
    $sent = $webPush->sendNotification(
        $notifications[0]['subscription'],
        $notifications[0]['payload'], // optional (defaults null)
        true // optional (defaults false)
    );

}
