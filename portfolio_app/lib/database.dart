import 'package:portfolio_app/ex/secure_storage_database.dart';

class Database extends SecureStorageDatabase {
  Database._() : super(fieldPrefix: 'portfolio');
}

final database = Database._();
