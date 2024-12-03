"""Removed the name field from ticket table

Revision ID: 441a16feab7e
Revises: 79524cc45145
Create Date: 2024-12-01 10:54:59.638876

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '441a16feab7e'
down_revision: Union[str, None] = '79524cc45145'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, 'events', ['id'])
    op.create_unique_constraint(None, 'orders', ['id'])
    op.create_unique_constraint(None, 'tickets', ['id'])
    op.drop_column('tickets', 'name')
    op.create_unique_constraint(None, 'users', ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'users', type_='unique')
    op.add_column('tickets', sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'tickets', type_='unique')
    op.drop_constraint(None, 'orders', type_='unique')
    op.drop_constraint(None, 'events', type_='unique')
    # ### end Alembic commands ###
