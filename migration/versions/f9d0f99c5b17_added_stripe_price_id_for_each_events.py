"""added stripe price id for each events

Revision ID: f9d0f99c5b17
Revises: 15b4f0d5b194
Create Date: 2024-12-02 00:24:42.823300

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f9d0f99c5b17'
down_revision: Union[str, None] = '15b4f0d5b194'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('events', sa.Column('stripe_price_id', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('events', 'stripe_price_id')
    # ### end Alembic commands ###
