import 'package:flutter/material.dart';
import 'package:portfolio_app/api/schema.gen.dart';
import 'package:portfolio_app/color.dart';
import 'package:portfolio_app/ex/app.dart';

class ContactCardView extends StatelessWidget {
  final ContactShowResItem contact;

  const ContactCardView({
    super.key,
    required this.contact,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () async {
        if (contact.type == ContactType.GITHUB) {
          await openBrowser(contact.href, context);
          return;
        }

        if (contact.type == ContactType.INSTAGRAM) {
          await openBrowser(contact.href, context);
          return;
        }

        // TODO :: 시뮬레이터에는 메일앱이 존재하지 않아 실행되지 않으니, 실기기로 테스트 해볼 것.
        await mailTo(contact.href, context);
      },
      child: Container(
        margin: const EdgeInsets.all(8.0),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16.0),
          border: Border.all(color: primaryColor),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(
              height: 24.0,
            ),
            Center(
              child: Container(
                padding: EdgeInsets.all(12.0),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: primaryColor),
                ),
                // TODO :: 아이콘 분기 처리
                child: toIcon(contact.type),
              ),
            ),
            SizedBox(
              width: 1,
              height: 16.0,
              child: Container(
                color: primaryColor,
              ),
            ),
            Text(
              toLabel(contact.type),
              style: const TextStyle(
                fontSize: 20.0,
                fontWeight: FontWeight.w700,
                color: primaryColor,
              ),
            ),
            const SizedBox(
              height: 8.0,
            ),
            Text(
              contact.id,
              style: const TextStyle(fontSize: 14.0, color: primaryColor),
            ),
            const SizedBox(
              height: 24.0,
            )
          ],
        ),
      ),
    );
  }

  String toLabel(ContactType type) {
    switch (type) {
      case ContactType.EMAIL:
        return "EMAIL";
      case ContactType.GITHUB:
        return "GITHUB";
      case ContactType.INSTAGRAM:
        return "INSTAGRAM";
    }
  }

  Widget toIcon(ContactType type) {
    switch (type) {
      case ContactType.EMAIL:
        return const Icon(
          Icons.email_outlined,
          color: primaryColor,
          size: 24.0,
        );
      case ContactType.GITHUB:
        // TODO :: github icon 추가되면 수정
        return Image.asset(Assets.icon.instagramIcon.path);
      case ContactType.INSTAGRAM:
        return Image.asset(Assets.icon.instagramIcon.path);
    }
  }
}
