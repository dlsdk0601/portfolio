import 'package:flutter/material.dart';
import 'package:portfolio_app/api/schema.gen.dart';
import 'package:portfolio_app/color.dart';

class ContactCardView extends StatelessWidget {
  final ContactShowResItem contact;
  final VoidCallback onTap;

  const ContactCardView(
      {super.key, required this.contact, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
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
                child: const Icon(
                  Icons.abc,
                  color: primaryColor,
                  size: 24.0,
                ),
              ),
            ),
            const SizedBox(
              height: 16.0,
            ),
            Text(
              contact.type.toString(),
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
